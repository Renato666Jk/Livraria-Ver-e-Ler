import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { useState } from 'react';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const Cart = () => {
    const { cartItems, loading, removeFromCart, clearCart, cartTotal, fetchCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleRemove = async (bookId) => {
        try {
            await removeFromCart(bookId);
            toast.success('Item removido do carrinho');
        } catch (error) {
            toast.error('Erro ao remover item');
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Faça login para continuar');
            navigate('/login');
            return;
        }

        setCheckingOut(true);
        try {
            const response = await axios.post(`${API}/checkout`, {}, { withCredentials: true });
            navigate('/checkout', { state: { order: response.data } });
        } catch (error) {
            const message = error.response?.data?.detail || 'Erro ao processar pedido';
            toast.error(message);
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-[#F4F1EA]" data-testid="cart-page">
            {/* Header */}
            <section className="bg-[#0A1128] py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="overline text-[#D4AF37] mb-4">Sua Seleção</p>
                    <h1 className="font-heading text-4xl md:text-5xl text-[#FDFBF7]">
                        Carrinho de Compras
                    </h1>
                </div>
            </section>

            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-[#C5A059]" strokeWidth={1} />
                            <h2 className="font-heading text-2xl text-[#0A1128] mb-4">Seu carrinho está vazio</h2>
                            <p className="text-[#4A4A4A] mb-8">Explore nossa coleção e encontre seu próximo livro favorito.</p>
                            <Link to="/marketplace" className="btn-primary" data-testid="explore-btn">
                                Explorar Livros
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-6">
                                {cartItems.map((item) => (
                                    <div 
                                        key={item.book_id}
                                        className="flex gap-6 p-6 bg-white border border-[#D4AF37]/20"
                                        data-testid={`cart-item-${item.book_id}`}
                                    >
                                        {/* Book Cover */}
                                        <Link to={`/livro/${item.book_id}`} className="flex-shrink-0">
                                            {item.book?.cover_url ? (
                                                <img 
                                                    src={item.book.cover_url}
                                                    alt={item.book.title}
                                                    className="w-24 h-32 object-cover"
                                                />
                                            ) : (
                                                <div className="w-24 h-32 bg-[#EAE6D9] flex items-center justify-center">
                                                    <span className="text-[#C5A059] font-heading text-xl">
                                                        {item.book?.title?.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <Link to={`/livro/${item.book_id}`}>
                                                <h3 className="font-heading text-xl text-[#0A1128] mb-1 hover:text-[#D4AF37] transition-colors">
                                                    {item.book?.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-[#4A4A4A] mb-4">
                                                por {item.book?.author_name}
                                            </p>
                                            <p className="price-tag">
                                                R$ {item.book?.price?.toFixed(2).replace('.', ',')}
                                            </p>
                                        </div>

                                        {/* Remove */}
                                        <button 
                                            onClick={() => handleRemove(item.book_id)}
                                            className="p-2 text-[#4A4A4A] hover:text-red-500 transition-colors self-start"
                                            data-testid={`remove-item-${item.book_id}`}
                                        >
                                            <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-8 border border-[#D4AF37]/20 sticky top-24">
                                    <h3 className="font-heading text-2xl text-[#0A1128] mb-6">Resumo do Pedido</h3>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-[#4A4A4A]">Subtotal ({cartItems.length} itens)</span>
                                            <span className="text-[#0A1128]">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#4A4A4A]">Frete</span>
                                            <span className="text-[#D4AF37]">Grátis</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-[#D4AF37]/20 my-6"></div>

                                    <div className="flex justify-between mb-8">
                                        <span className="font-heading text-xl text-[#0A1128]">Total</span>
                                        <span className="font-heading text-2xl text-[#D4AF37]">
                                            R$ {cartTotal.toFixed(2).replace('.', ',')}
                                        </span>
                                    </div>

                                    <button 
                                        onClick={handleCheckout}
                                        disabled={checkingOut}
                                        className="w-full btn-gold flex items-center justify-center gap-2"
                                        data-testid="checkout-btn"
                                    >
                                        {checkingOut ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <>
                                                Finalizar Compra
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>

                                    <Link to="/marketplace" className="block text-center mt-4 text-[#4A4A4A] hover:text-[#D4AF37] transition-colors">
                                        Continuar Comprando
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Cart;
