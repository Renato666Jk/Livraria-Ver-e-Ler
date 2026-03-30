import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BookCard = ({ book }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
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

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star 
                    key={i}
                    className={`w-4 h-4 ${i <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#EAE6D9]'}`}
                    strokeWidth={1.5}
                />
            );
        }
        return stars;
    };

    return (
        <Link 
            to={`/livro/${book.id}`}
            className="boutique-card book-card group block"
            data-testid={`book-card-${book.id}`}
        >
            {/* Cover Image */}
            <div className="image-zoom mb-6 aspect-[3/4] bg-[#EAE6D9] relative">
                {book.cover_url ? (
                    <img 
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#C5A059] font-heading text-2xl">{book.title.charAt(0)}</span>
                    </div>
                )}
                
                {/* Approved Badge */}
                {book.owner_approved && (
                    <div className="absolute top-4 left-4 seal-badge" data-testid="approved-seal">
                        Selo do Autor
                    </div>
                )}

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-[#0A1128]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                        onClick={handleAddToCart}
                        className="p-3 bg-[#D4AF37] text-[#0A1128] hover:bg-[#C5A059] transition-colors"
                        data-testid={`add-cart-${book.id}`}
                    >
                        <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                    <span className="p-3 bg-white text-[#0A1128]">
                        <Eye className="w-5 h-5" strokeWidth={1.5} />
                    </span>
                </div>
            </div>

            {/* Genre */}
            <p className="overline mb-2">{book.genre}</p>

            {/* Title */}
            <h3 className="font-heading text-xl text-[#0A1128] mb-2 line-clamp-2">
                {book.title}
            </h3>

            {/* Author */}
            <p className="text-sm text-[#4A4A4A] mb-3">
                por {book.author_name}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                    {renderStars(book.average_rating || 0)}
                </div>
                {book.reviews_count > 0 && (
                    <span className="text-xs text-[#4A4A4A]">
                        ({book.reviews_count})
                    </span>
                )}
            </div>

            {/* Price */}
            <p className="price-tag">
                R$ {book.price?.toFixed(2).replace('.', ',')}
            </p>
        </Link>
    );
};

export default BookCard;
