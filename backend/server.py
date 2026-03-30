from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, File, UploadFile, Query, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId
import requests

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'livraria-ver-e-ler-secret-key-2024')
JWT_ALGORITHM = "HS256"

# Object Storage Configuration
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "livraria-ver-e-ler"
storage_key = None

# PIX Configuration (placeholder for user to configure)
PIX_KEY = os.environ.get("PIX_KEY", "")

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ PASSWORD HASHING ============
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# ============ JWT TOKENS ============
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Tipo de token inválido")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

async def get_optional_user(request: Request) -> Optional[dict]:
    try:
        return await get_current_user(request)
    except HTTPException:
        return None

# ============ OBJECT STORAGE ============
def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    if not EMERGENT_KEY:
        logger.warning("EMERGENT_LLM_KEY not set, file uploads will be disabled")
        return None
    try:
        resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Object storage initialized successfully")
        return storage_key
    except Exception as e:
        logger.error(f"Failed to initialize storage: {e}")
        return None

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage not initialized")
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120
    )
    resp.raise_for_status()
    return resp.json()

def get_object(path: str) -> tuple:
    key = init_storage()
    if not key:
        raise HTTPException(status_code=500, detail="Storage not initialized")
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# ============ PYDANTIC MODELS ============
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "reader"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    approved: bool = False
    pix_key: Optional[str] = None

class AuthorProfileUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    pix_key: Optional[str] = None

class BookCreate(BaseModel):
    title: str
    synopsis: str
    price: float
    genre: str
    sample_chapter: Optional[str] = None

class BookUpdate(BaseModel):
    title: Optional[str] = None
    synopsis: Optional[str] = None
    price: Optional[float] = None
    genre: Optional[str] = None
    sample_chapter: Optional[str] = None

class ReviewCreate(BaseModel):
    book_id: str
    rating: int = Field(ge=1, le=5)
    comment: str

class SubmissionCreate(BaseModel):
    title: str
    synopsis: str
    message: Optional[str] = None

class SubmissionFeedback(BaseModel):
    status: str
    feedback: str
    approved: bool = False

class MessageCreate(BaseModel):
    to_user_id: str
    content: str

class CartItemCreate(BaseModel):
    book_id: str
    quantity: int = 1

class CheckoutRequest(BaseModel):
    pass

# ============ AUTH ENDPOINTS ============
@api_router.post("/auth/register")
async def register(user_data: UserRegister, response: Response):
    email = user_data.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    user_doc = {
        "email": email,
        "password_hash": hash_password(user_data.password),
        "name": user_data.name,
        "role": user_data.role if user_data.role in ["reader", "author"] else "reader",
        "bio": "",
        "avatar_url": None,
        "approved": False if user_data.role == "author" else True,
        "pix_key": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": email,
        "name": user_data.name,
        "role": user_doc["role"],
        "approved": user_doc["approved"]
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin, response: Response):
    email = user_data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    if not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "bio": user.get("bio", ""),
        "avatar_url": user.get("avatar_url"),
        "approved": user.get("approved", False),
        "pix_key": user.get("pix_key")
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logout realizado com sucesso"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

# ============ AUTHOR ENDPOINTS ============
@api_router.get("/authors")
async def list_authors(approved_only: bool = True):
    query = {"role": "author"}
    if approved_only:
        query["approved"] = True
    
    authors = await db.users.find(query, {"password_hash": 0}).to_list(100)
    for author in authors:
        author["id"] = str(author.pop("_id"))
        # Get book count
        book_count = await db.books.count_documents({"author_id": author["id"], "owner_approved": True})
        author["book_count"] = book_count
    return authors

@api_router.get("/authors/{author_id}")
async def get_author(author_id: str):
    author = await db.users.find_one({"_id": ObjectId(author_id), "role": "author"}, {"password_hash": 0})
    if not author:
        raise HTTPException(status_code=404, detail="Autor não encontrado")
    author["id"] = str(author.pop("_id"))
    
    # Get author's books
    books = await db.books.find({"author_id": author_id, "owner_approved": True}, {"_id": 0}).to_list(100)
    author["books"] = books
    return author

@api_router.put("/authors/profile")
async def update_author_profile(profile: AuthorProfileUpdate, request: Request):
    user = await get_current_user(request)
    if user["role"] not in ["author", "owner"]:
        raise HTTPException(status_code=403, detail="Apenas autores podem atualizar perfil")
    
    update_data = {k: v for k, v in profile.model_dump().items() if v is not None}
    if update_data:
        await db.users.update_one({"_id": ObjectId(user["_id"])}, {"$set": update_data})
    
    return {"message": "Perfil atualizado com sucesso"}

# ============ BOOK ENDPOINTS ============
@api_router.get("/books")
async def list_books(
    genre: Optional[str] = None,
    author_id: Optional[str] = None,
    search: Optional[str] = None,
    owner_only: bool = False
):
    query = {}
    
    if owner_only:
        owner = await db.users.find_one({"role": "owner"})
        if owner:
            query["author_id"] = str(owner["_id"])
    elif author_id:
        query["author_id"] = author_id
    
    if genre:
        query["genre"] = genre
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"synopsis": {"$regex": search, "$options": "i"}}
        ]
    
    # Only show approved books for public
    if not owner_only:
        query["owner_approved"] = True
    
    books = await db.books.find(query, {"_id": 0}).to_list(100)
    
    # Add author info to each book
    for book in books:
        author = await db.users.find_one({"_id": ObjectId(book["author_id"])}, {"password_hash": 0})
        if author:
            book["author_name"] = author["name"]
    
    return books

@api_router.get("/books/{book_id}")
async def get_book(book_id: str):
    book = await db.books.find_one({"id": book_id}, {"_id": 0})
    if not book:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    # Get author info
    author = await db.users.find_one({"_id": ObjectId(book["author_id"])}, {"password_hash": 0})
    if author:
        book["author_name"] = author["name"]
        book["author_bio"] = author.get("bio", "")
    
    # Get reviews
    reviews = await db.reviews.find({"book_id": book_id}, {"_id": 0}).to_list(100)
    for review in reviews:
        reviewer = await db.users.find_one({"_id": ObjectId(review["user_id"])}, {"name": 1})
        if reviewer:
            review["user_name"] = reviewer["name"]
    book["reviews"] = reviews
    
    return book

@api_router.post("/books")
async def create_book(book: BookCreate, request: Request):
    user = await get_current_user(request)
    if user["role"] not in ["author", "owner"]:
        raise HTTPException(status_code=403, detail="Apenas autores podem criar livros")
    
    book_id = str(uuid.uuid4())
    book_doc = {
        "id": book_id,
        "author_id": user["_id"],
        "title": book.title,
        "synopsis": book.synopsis,
        "price": book.price,
        "genre": book.genre,
        "sample_chapter": book.sample_chapter,
        "cover_url": None,
        "sample_pdf_url": None,
        "owner_approved": user["role"] == "owner",
        "reviews_count": 0,
        "average_rating": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.books.insert_one(book_doc)
    book_doc.pop("_id", None)
    return book_doc

@api_router.put("/books/{book_id}")
async def update_book(book_id: str, book: BookUpdate, request: Request):
    user = await get_current_user(request)
    
    existing = await db.books.find_one({"id": book_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    if existing["author_id"] != user["_id"] and user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Sem permissão para editar este livro")
    
    update_data = {k: v for k, v in book.model_dump().items() if v is not None}
    if update_data:
        await db.books.update_one({"id": book_id}, {"$set": update_data})
    
    return {"message": "Livro atualizado com sucesso"}

@api_router.delete("/books/{book_id}")
async def delete_book(book_id: str, request: Request):
    user = await get_current_user(request)
    
    existing = await db.books.find_one({"id": book_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    if existing["author_id"] != user["_id"] and user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Sem permissão para deletar este livro")
    
    await db.books.delete_one({"id": book_id})
    return {"message": "Livro deletado com sucesso"}

# ============ REVIEW ENDPOINTS ============
@api_router.post("/reviews")
async def create_review(review: ReviewCreate, request: Request):
    user = await get_current_user(request)
    
    book = await db.books.find_one({"id": review.book_id})
    if not book:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    # Check if user already reviewed
    existing = await db.reviews.find_one({"book_id": review.book_id, "user_id": user["_id"]})
    if existing:
        raise HTTPException(status_code=400, detail="Você já avaliou este livro")
    
    review_doc = {
        "id": str(uuid.uuid4()),
        "book_id": review.book_id,
        "user_id": user["_id"],
        "rating": review.rating,
        "comment": review.comment,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.reviews.insert_one(review_doc)
    
    # Update book stats
    reviews = await db.reviews.find({"book_id": review.book_id}).to_list(1000)
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews)
    await db.books.update_one(
        {"id": review.book_id},
        {"$set": {"reviews_count": len(reviews), "average_rating": round(avg_rating, 1)}}
    )
    
    review_doc.pop("_id", None)
    return review_doc

# ============ SUBMISSION ENDPOINTS ============
@api_router.post("/submissions")
async def create_submission(submission: SubmissionCreate, request: Request):
    user = await get_current_user(request)
    
    submission_doc = {
        "id": str(uuid.uuid4()),
        "author_id": user["_id"],
        "author_name": user["name"],
        "author_email": user["email"],
        "title": submission.title,
        "synopsis": submission.synopsis,
        "message": submission.message,
        "manuscript_url": None,
        "status": "pending",
        "feedback": None,
        "approved": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.submissions.insert_one(submission_doc)
    submission_doc.pop("_id", None)
    return submission_doc

@api_router.get("/submissions")
async def list_submissions(request: Request, status: Optional[str] = None):
    user = await get_current_user(request)
    
    if user["role"] == "owner":
        query = {}
        if status:
            query["status"] = status
    else:
        query = {"author_id": user["_id"]}
    
    submissions = await db.submissions.find(query, {"_id": 0}).to_list(100)
    return submissions

@api_router.put("/submissions/{submission_id}/feedback")
async def submit_feedback(submission_id: str, feedback: SubmissionFeedback, request: Request):
    user = await get_current_user(request)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Apenas o dono pode dar feedback")
    
    submission = await db.submissions.find_one({"id": submission_id})
    if not submission:
        raise HTTPException(status_code=404, detail="Submissão não encontrada")
    
    update_data = {
        "status": feedback.status,
        "feedback": feedback.feedback,
        "approved": feedback.approved,
        "reviewed_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.submissions.update_one({"id": submission_id}, {"$set": update_data})
    
    # If approved, mark author as approved
    if feedback.approved:
        await db.users.update_one({"_id": ObjectId(submission["author_id"])}, {"$set": {"approved": True}})
    
    return {"message": "Feedback enviado com sucesso"}

# ============ MESSAGE ENDPOINTS ============
@api_router.post("/messages")
async def send_message(message: MessageCreate, request: Request):
    user = await get_current_user(request)
    
    message_doc = {
        "id": str(uuid.uuid4()),
        "from_user_id": user["_id"],
        "from_user_name": user["name"],
        "to_user_id": message.to_user_id,
        "content": message.content,
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.messages.insert_one(message_doc)
    message_doc.pop("_id", None)
    return message_doc

@api_router.get("/messages")
async def list_messages(request: Request):
    user = await get_current_user(request)
    
    messages = await db.messages.find(
        {"$or": [{"from_user_id": user["_id"]}, {"to_user_id": user["_id"]}]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return messages

@api_router.get("/messages/unread-count")
async def get_unread_count(request: Request):
    user = await get_current_user(request)
    count = await db.messages.count_documents({"to_user_id": user["_id"], "read": False})
    return {"count": count}

# ============ CART ENDPOINTS ============
@api_router.get("/cart")
async def get_cart(request: Request):
    user = await get_current_user(request)
    
    cart_items = await db.cart_items.find({"user_id": user["_id"]}, {"_id": 0}).to_list(100)
    
    # Enrich with book data
    for item in cart_items:
        book = await db.books.find_one({"id": item["book_id"]}, {"_id": 0})
        if book:
            item["book"] = book
    
    return cart_items

@api_router.post("/cart")
async def add_to_cart(item: CartItemCreate, request: Request):
    user = await get_current_user(request)
    
    book = await db.books.find_one({"id": item.book_id})
    if not book:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    # Check if already in cart
    existing = await db.cart_items.find_one({"user_id": user["_id"], "book_id": item.book_id})
    if existing:
        await db.cart_items.update_one(
            {"user_id": user["_id"], "book_id": item.book_id},
            {"$inc": {"quantity": item.quantity}}
        )
    else:
        cart_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user["_id"],
            "book_id": item.book_id,
            "quantity": item.quantity,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.cart_items.insert_one(cart_doc)
    
    return {"message": "Item adicionado ao carrinho"}

@api_router.delete("/cart/{book_id}")
async def remove_from_cart(book_id: str, request: Request):
    user = await get_current_user(request)
    await db.cart_items.delete_one({"user_id": user["_id"], "book_id": book_id})
    return {"message": "Item removido do carrinho"}

@api_router.delete("/cart")
async def clear_cart(request: Request):
    user = await get_current_user(request)
    await db.cart_items.delete_many({"user_id": user["_id"]})
    return {"message": "Carrinho limpo"}

# ============ CHECKOUT / ORDER ENDPOINTS ============
@api_router.post("/checkout")
async def checkout(request: Request):
    user = await get_current_user(request)
    
    cart_items = await db.cart_items.find({"user_id": user["_id"]}).to_list(100)
    if not cart_items:
        raise HTTPException(status_code=400, detail="Carrinho vazio")
    
    order_items = []
    total = 0
    
    for item in cart_items:
        book = await db.books.find_one({"id": item["book_id"]}, {"_id": 0})
        if book:
            order_items.append({
                "book_id": item["book_id"],
                "title": book["title"],
                "price": book["price"],
                "quantity": item["quantity"]
            })
            total += book["price"] * item["quantity"]
    
    order_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["_id"],
        "user_email": user["email"],
        "items": order_items,
        "total": round(total, 2),
        "pix_key": PIX_KEY or "PIX_KEY_NAO_CONFIGURADA",
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.orders.insert_one(order_doc)
    
    # Clear cart
    await db.cart_items.delete_many({"user_id": user["_id"]})
    
    order_doc.pop("_id", None)
    return order_doc

@api_router.get("/orders")
async def list_orders(request: Request):
    user = await get_current_user(request)
    
    if user["role"] == "owner":
        orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    else:
        orders = await db.orders.find({"user_id": user["_id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    return orders

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str = Query(...), request: Request = None):
    user = await get_current_user(request)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Apenas o dono pode atualizar status")
    
    await db.orders.update_one({"id": order_id}, {"$set": {"status": status}})
    return {"message": "Status atualizado"}

# ============ FILE UPLOAD ENDPOINTS ============
@api_router.post("/upload/cover/{book_id}")
async def upload_cover(book_id: str, file: UploadFile = File(...), request: Request = None):
    user = await get_current_user(request)
    
    book = await db.books.find_one({"id": book_id})
    if not book:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    if book["author_id"] != user["_id"] and user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Sem permissão")
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    path = f"{APP_NAME}/covers/{book_id}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    
    result = put_object(path, data, file.content_type or "image/jpeg")
    
    await db.books.update_one({"id": book_id}, {"$set": {"cover_url": result["path"]}})
    
    return {"path": result["path"]}

@api_router.post("/upload/sample/{book_id}")
async def upload_sample(book_id: str, file: UploadFile = File(...), request: Request = None):
    user = await get_current_user(request)
    
    book = await db.books.find_one({"id": book_id})
    if not book:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    if book["author_id"] != user["_id"] and user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Sem permissão")
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
    path = f"{APP_NAME}/samples/{book_id}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    
    result = put_object(path, data, file.content_type or "application/pdf")
    
    await db.books.update_one({"id": book_id}, {"$set": {"sample_pdf_url": result["path"]}})
    
    return {"path": result["path"]}

@api_router.post("/upload/avatar")
async def upload_avatar(file: UploadFile = File(...), request: Request = None):
    user = await get_current_user(request)
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    path = f"{APP_NAME}/avatars/{user['_id']}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    
    result = put_object(path, data, file.content_type or "image/jpeg")
    
    await db.users.update_one({"_id": ObjectId(user["_id"])}, {"$set": {"avatar_url": result["path"]}})
    
    return {"path": result["path"]}

@api_router.post("/upload/manuscript/{submission_id}")
async def upload_manuscript(submission_id: str, file: UploadFile = File(...), request: Request = None):
    user = await get_current_user(request)
    
    submission = await db.submissions.find_one({"id": submission_id})
    if not submission:
        raise HTTPException(status_code=404, detail="Submissão não encontrada")
    
    if submission["author_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Sem permissão")
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
    path = f"{APP_NAME}/manuscripts/{submission_id}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    
    result = put_object(path, data, file.content_type or "application/pdf")
    
    await db.submissions.update_one({"id": submission_id}, {"$set": {"manuscript_url": result["path"]}})
    
    return {"path": result["path"]}

@api_router.get("/files/{path:path}")
async def download_file(path: str):
    try:
        data, content_type = get_object(path)
        return Response(content=data, media_type=content_type)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

# ============ OWNER ENDPOINTS ============
@api_router.get("/owner")
async def get_owner():
    owner = await db.users.find_one({"role": "owner"}, {"password_hash": 0})
    if not owner:
        return None
    owner["id"] = str(owner.pop("_id"))
    return owner

@api_router.put("/owner/approve-book/{book_id}")
async def approve_book(book_id: str, approved: bool = True, request: Request = None):
    user = await get_current_user(request)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Apenas o dono pode aprovar livros")
    
    await db.books.update_one({"id": book_id}, {"$set": {"owner_approved": approved}})
    return {"message": "Livro aprovado" if approved else "Aprovação removida"}

@api_router.put("/owner/approve-author/{author_id}")
async def approve_author(author_id: str, approved: bool = True, request: Request = None):
    user = await get_current_user(request)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Apenas o dono pode aprovar autores")
    
    await db.users.update_one({"_id": ObjectId(author_id)}, {"$set": {"approved": approved}})
    return {"message": "Autor aprovado" if approved else "Aprovação removida"}

@api_router.get("/owner/pending-books")
async def get_pending_books(request: Request):
    user = await get_current_user(request)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Apenas o dono pode ver livros pendentes")
    
    books = await db.books.find({"owner_approved": False}, {"_id": 0}).to_list(100)
    for book in books:
        author = await db.users.find_one({"_id": ObjectId(book["author_id"])}, {"name": 1})
        if author:
            book["author_name"] = author["name"]
    return books

@api_router.get("/owner/pending-authors")
async def get_pending_authors(request: Request):
    user = await get_current_user(request)
    if user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Apenas o dono pode ver autores pendentes")
    
    authors = await db.users.find({"role": "author", "approved": False}, {"password_hash": 0}).to_list(100)
    for author in authors:
        author["id"] = str(author.pop("_id"))
    return authors

# ============ GENRES ============
@api_router.get("/genres")
async def list_genres():
    return [
        {"id": "ficcao", "name": "Ficção"},
        {"id": "romance", "name": "Romance"},
        {"id": "autoajuda", "name": "Autoajuda"},
        {"id": "biografia", "name": "Biografia"},
        {"id": "fantasia", "name": "Fantasia"},
        {"id": "misterio", "name": "Mistério"},
        {"id": "historia", "name": "História"},
        {"id": "poesia", "name": "Poesia"},
        {"id": "negocios", "name": "Negócios"},
        {"id": "espiritualidade", "name": "Espiritualidade"}
    ]

# ============ HEALTH CHECK ============
@api_router.get("/")
async def root():
    return {"message": "Livraria Ver e Ler API", "status": "online"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get('FRONTEND_URL', 'http://localhost:3000')] + os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.books.create_index("author_id")
    await db.books.create_index("genre")
    await db.reviews.create_index("book_id")
    await db.cart_items.create_index([("user_id", 1), ("book_id", 1)])
    await db.messages.create_index("to_user_id")
    await db.orders.create_index("user_id")
    
    # Initialize storage
    try:
        init_storage()
    except Exception as e:
        logger.warning(f"Storage initialization failed: {e}")
    
    # Seed owner account
    owner_email = os.environ.get("OWNER_EMAIL", "sandro@vereler.com")
    owner_password = os.environ.get("OWNER_PASSWORD", "owner123")
    
    existing_owner = await db.users.find_one({"email": owner_email})
    if not existing_owner:
        owner_doc = {
            "email": owner_email,
            "password_hash": hash_password(owner_password),
            "name": "Sandro Gonçalves",
            "role": "owner",
            "bio": "Escritor, mentor literário e fundador da Livraria Ver e Ler. Autor de 'Muito Além do Que Seus Olhos Veem', 'Além do Tempo' e 'Você Sabia? Vencendo a Ansiedade'. Minha missão é ajudar novos autores a realizarem o sonho de publicar seus livros.",
            "avatar_url": "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/8tlrve9z_0000.PNG",
            "approved": True,
            "pix_key": PIX_KEY,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        result = await db.users.insert_one(owner_doc)
        owner_id = str(result.inserted_id)
        logger.info(f"Owner account created: {owner_email}")
        
        # Seed owner's books
        books = [
            {
                "id": str(uuid.uuid4()),
                "author_id": owner_id,
                "title": "Muito Além do Que Seus Olhos Veem",
                "synopsis": "7 chaves para ativar o milagre. Uma jornada transformadora que vai além do que seus olhos podem ver, revelando verdades profundas sobre fé, propósito e realização pessoal.",
                "price": 49.90,
                "genre": "espiritualidade",
                "sample_chapter": "Capítulo 1: A Visão Além do Visível\n\nQuando olhamos para o mundo ao nosso redor, vemos apenas a superfície das coisas. Mas existe uma dimensão mais profunda, uma realidade que transcende o que nossos olhos físicos podem captar...",
                "cover_url": "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/1zr252gv_111.PNG",
                "sample_pdf_url": None,
                "owner_approved": True,
                "reviews_count": 0,
                "average_rating": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "author_id": owner_id,
                "title": "Além do Tempo",
                "synopsis": "A Jornada de Charlotte em Busca do Amor Perdido. Um romance envolvente que atravessa décadas, contando a história de um amor que desafia o tempo e as circunstâncias.",
                "price": 44.90,
                "genre": "romance",
                "sample_chapter": "Capítulo 1: O Encontro\n\nCharlotte nunca imaginou que uma simples tarde de verão mudaria sua vida para sempre. O sol dourado banhava a praia enquanto ela caminhava distraída pela areia...",
                "cover_url": "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/2nj7ucv4_444444.PNG",
                "sample_pdf_url": None,
                "owner_approved": True,
                "reviews_count": 0,
                "average_rating": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "author_id": owner_id,
                "title": "Você Sabia? Vencendo a Ansiedade",
                "synopsis": "Descubra como controlar seus pensamentos e conquistar uma vida plena e feliz. Um guia prático para superar a ansiedade e encontrar paz interior.",
                "price": 39.90,
                "genre": "autoajuda",
                "sample_chapter": "Capítulo 1: Entendendo a Ansiedade\n\nA ansiedade é uma resposta natural do nosso corpo a situações de perigo ou estresse. No entanto, quando ela se torna constante e desproporcional, pode afetar significativamente nossa qualidade de vida...",
                "cover_url": "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/gdbxtfhg_qq.PNG",
                "sample_pdf_url": None,
                "owner_approved": True,
                "reviews_count": 0,
                "average_rating": 0,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        
        for book in books:
            await db.books.insert_one(book)
        logger.info("Owner's books seeded")
    
    # Write test credentials
    try:
        os.makedirs("/app/memory", exist_ok=True)
        with open("/app/memory/test_credentials.md", "w") as f:
            f.write(f"""# Test Credentials

## Owner Account
- Email: {owner_email}
- Password: {owner_password}
- Role: owner

## Auth Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
""")
    except Exception as e:
        logger.warning(f"Failed to write test credentials: {e}")
    
    logger.info("Startup complete")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
