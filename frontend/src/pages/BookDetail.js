import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, BookOpen, User, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSampleChapter, setShowSampleChapter] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`${API}/books/${id}`);
                setBook(response.data);
            } catch (error) {
                console.error('Error fetching book:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Faça login para adicionar ao carrinho');
            return;
        }
        try {
            await addToCart(book.id);
            toast.success('Livro adicionado ao carrinho!');
        } catch (error) {
            toast.error('Erro ao adicionar ao carrinho');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Faça login para avaliar');
            return;
        }
        
        setSubmittingReview(true);
        try {
            await axios.post(`${API}/reviews`, {
                book_id: book.id,
                rating: newReview.rating,
                comment: newReview.comment
            }, { withCredentials: true });
            
            toast.success('Avaliação enviada!');
            setNewReview({ rating: 5, comment: '' });
            
            // Refresh book data
            const response = await axios.get(`${API}/books/${id}`);
            setBook(response.data);
        } catch (error) {
            const message = error.response?.data?.detail || 'Erro ao enviar avaliação';
            toast.error(message);
        } finally {
            setSubmittingReview(false);
        }
    };

    const renderStars = (rating, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star 
                    key={i}
                    className={`w-5 h-5 ${i <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#EAE6D9]'} ${interactive ? 'cursor-pointer' : ''}`}
                    strokeWidth={1.5}
                    onClick={interactive ? () => setNewReview({ ...newReview, rating: i }) : undefined}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <p className="text-[#4A4A4A]">Livro não encontrado.</p>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-[#F4F1EA]" data-testid="book-detail-page">
            {/* Breadcrumb */}
            <div className="bg-[#EAE6D9] py-4">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <Link to="/marketplace" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#D4AF37] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o Mercado
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Book Cover */}
                        <div className="relative">
                            {book.owner_approved && (
                                <div className="absolute top-4 left-4 z-10 seal-badge" data-testid="book-seal">
                                    Selo do Autor
                                </div>
                            )}
                            <div className="bg-white p-8 border border-[#D4AF37]/20">
                                {book.cover_url ? (
                                    <img 
                                        src={book.cover_url}
                                        alt={book.title}
                                        className="w-full h-auto"
                                    />
                                ) : (
                                    <div className="aspect-[3/4] bg-[#EAE6D9] flex items-center justify-center">
                                        <BookOpen className="w-24 h-24 text-[#C5A059]" strokeWidth={1} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Book Info */}
                        <div>
                            <p className="overline mb-4">{book.genre}</p>
                            <h1 className="font-heading text-4xl md:text-5xl text-[#0A1128] mb-4">
                                {book.title}
                            </h1>
                            
                            <p className="text-lg text-[#4A4A4A] mb-4">
                                por <span className="text-[#0A1128] font-medium">{book.author_name}</span>
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex">
                                    {renderStars(book.average_rating || 0)}
                                </div>
                                <span className="text-[#4A4A4A]">
                                    {book.average_rating?.toFixed(1) || '0.0'} ({book.reviews_count || 0} avaliações)
                                </span>
                            </div>

                            {/* Price */}
                            <div className="mb-8">
                                <p className="font-heading text-4xl text-[#D4AF37]">
                                    R$ {book.price?.toFixed(2).replace('.', ',')}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button 
                                    onClick={handleAddToCart}
                                    className="btn-gold flex items-center justify-center gap-2"
                                    data-testid="add-to-cart-btn"
                                >
                                    <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                                    Adicionar ao Carrinho
                                </button>
                                {book.sample_chapter && (
                                    <button 
                                        onClick={() => setShowSampleChapter(!showSampleChapter)}
                                        className="btn-secondary"
                                        data-testid="sample-chapter-btn"
                                    >
                                        {showSampleChapter ? 'Ocultar Amostra' : 'Ler Amostra'}
                                    </button>
                                )}
                            </div>

                            {/* Synopsis */}
                            <div className="mb-8">
                                <h3 className="font-heading text-xl text-[#0A1128] mb-4">Sinopse</h3>
                                <p className="text-[#4A4A4A] leading-relaxed">{book.synopsis}</p>
                            </div>

                            {/* Author Bio */}
                            {book.author_bio && (
                                <div className="p-6 bg-[#EAE6D9] border-l-4 border-[#D4AF37]">
                                    <h4 className="font-heading text-lg text-[#0A1128] mb-2">Sobre o Autor</h4>
                                    <p className="text-[#4A4A4A] text-sm">{book.author_bio}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sample Chapter */}
                    {showSampleChapter && book.sample_chapter && (
                        <div className="mt-12 p-8 bg-white border border-[#D4AF37]/20" data-testid="sample-chapter-content">
                            <h3 className="font-heading text-2xl text-[#0A1128] mb-6">Capítulo de Amostra</h3>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-[#4A4A4A] leading-relaxed whitespace-pre-line">{book.sample_chapter}</p>
                            </div>
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="mt-16">
                        <h2 className="font-heading text-3xl text-[#0A1128] mb-8">Avaliações</h2>

                        {/* Review Form */}
                        {user && (
                            <form onSubmit={handleSubmitReview} className="mb-12 p-6 bg-white border border-[#D4AF37]/20" data-testid="review-form">
                                <h4 className="font-heading text-xl text-[#0A1128] mb-4">Deixe sua avaliação</h4>
                                
                                <div className="mb-4">
                                    <label className="block text-sm text-[#4A4A4A] mb-2">Sua nota</label>
                                    <div className="flex gap-1">
                                        {renderStars(newReview.rating, true)}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-[#4A4A4A] mb-2">Seu comentário</label>
                                    <textarea 
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full p-4 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none resize-none h-32"
                                        placeholder="Conte o que achou do livro..."
                                        required
                                        data-testid="review-comment-input"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    disabled={submittingReview}
                                    className="btn-primary"
                                    data-testid="submit-review-btn"
                                >
                                    {submittingReview ? 'Enviando...' : 'Enviar Avaliação'}
                                </button>
                            </form>
                        )}

                        {/* Reviews List */}
                        {book.reviews && book.reviews.length > 0 ? (
                            <div className="space-y-6">
                                {book.reviews.map((review, index) => (
                                    <div key={index} className="p-6 bg-white border border-[#D4AF37]/20" data-testid={`review-${index}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-[#0A1128] flex items-center justify-center">
                                                <User className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#0A1128]">{review.user_name}</p>
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[#4A4A4A]">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#4A4A4A] text-center py-8">
                                Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BookDetail;
