import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, BookOpen, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'A Minha História', href: '/historia' },
        { name: 'Meus Livros', href: '/livros-do-autor' },
        { name: 'Mercado de Autores', href: '/marketplace' },
        { name: 'Publicar Meu Livro', href: '/publicar' },
    ];

    return (
        <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#F4F1EA]/80 border-b border-[#D4AF37]/20" data-testid="main-header">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center" data-testid="logo-link">
                        <img 
                            src="https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/vvyjps96_image.png" 
                            alt="Livraria Ver e Ler" 
                            className="h-14 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name}
                                to={link.href}
                                className="nav-link text-sm font-medium"
                                data-testid={`nav-${link.href.replace('/', '')}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Cart */}
                        <Link to="/carrinho" className="relative p-2" data-testid="cart-link">
                            <ShoppingCart className="w-5 h-5 text-[#0A1128]" strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0A1128] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" data-testid="cart-count">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="hidden lg:flex items-center gap-4">
                                {(user.role === 'owner' || user.role === 'author') && (
                                    <Link 
                                        to="/dashboard" 
                                        className="flex items-center gap-2 text-sm font-medium text-[#0A1128] hover:text-[#D4AF37] transition-colors"
                                        data-testid="dashboard-link"
                                    >
                                        <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
                                        Dashboard
                                    </Link>
                                )}
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-medium text-[#0A1128] hover:text-[#D4AF37] transition-colors"
                                    data-testid="logout-btn"
                                >
                                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                                    Sair
                                </button>
                            </div>
                        ) : (
                            <Link 
                                to="/login"
                                className="hidden lg:flex items-center gap-2 btn-primary"
                                data-testid="login-link"
                            >
                                <User className="w-4 h-4" strokeWidth={1.5} />
                                Entrar
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2"
                            data-testid="mobile-menu-btn"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-[#0A1128]" />
                            ) : (
                                <Menu className="w-6 h-6 text-[#0A1128]" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-[#F4F1EA] border-t border-[#D4AF37]/20" data-testid="mobile-menu">
                    <nav className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name}
                                to={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-[#0A1128] font-medium py-2 border-b border-[#D4AF37]/10"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                {(user.role === 'owner' || user.role === 'author') && (
                                    <Link 
                                        to="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 text-[#0A1128] font-medium py-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                )}
                                <button 
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="flex items-center gap-2 text-[#0A1128] font-medium py-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn-primary text-center mt-4"
                            >
                                Entrar
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
