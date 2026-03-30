import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, PenTool } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const Home = () => {
    const [ownerBooks, setOwnerBooks] = useState([]);
    const [marketplaceBooks, setMarketplaceBooks] = useState([]);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ownerRes, booksRes, marketRes] = await Promise.all([
                    axios.get(`${API}/owner`),
                    axios.get(`${API}/books?owner_only=true`),
                    axios.get(`${API}/books`)
                ]);
                setOwner(ownerRes.data);
                setOwnerBooks(booksRes.data);
                setMarketplaceBooks(marketRes.data.filter(b => !booksRes.data.find(ob => ob.id === b.id)).slice(0, 4));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="pt-20" data-testid="home-page">
            {/* Hero Section */}
            <section className="hero-section min-h-[90vh] flex items-center relative" data-testid="hero-section">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="fade-in">
                            <p className="overline text-[#D4AF37] mb-6">Bem-vindo à</p>
                            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-[#FDFBF7] leading-tight mb-6">
                                Livraria<br />
                                <span className="text-[#D4AF37]">Ver e Ler</span>
                            </h1>
                            <p className="text-lg text-[#FDFBF7]/80 mb-8 max-w-lg">
                                Uma jornada literária onde cada página é uma nova descoberta. 
                                Explore nosso acervo exclusivo e conecte-se com histórias que transformam.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/livros-do-autor" className="btn-gold" data-testid="explore-books-btn">
                                    Explorar Livros
                                </Link>
                                <Link to="/publicar" className="btn-secondary bg-transparent border-[#FDFBF7] text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#0A1128]">
                                    Quero Publicar
                                </Link>
                            </div>
                        </div>

                        {/* Right - Book Covers */}
                        <div className="hidden lg:flex justify-end items-center gap-6 fade-in-delay-2">
                            <div className="space-y-6">
                                {ownerBooks.slice(0, 2).map((book, index) => (
                                    <div 
                                        key={book.id}
                                        className={`w-48 transform ${index === 0 ? 'translate-y-8' : '-translate-y-4'} shadow-2xl transition-transform hover:-translate-y-2`}
                                    >
                                        <img 
                                            src={book.cover_url}
                                            alt={book.title}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                ))}
                            </div>
                            {ownerBooks[2] && (
                                <div className="w-56 shadow-2xl">
                                    <img 
                                        src={ownerBooks[2].cover_url}
                                        alt={ownerBooks[2].title}
                                        className="w-full h-auto"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-3 bg-[#D4AF37] rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Owner's Books Section */}
            <section className="py-24 md:py-32 bg-[#F4F1EA]" data-testid="owner-books-section">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <p className="overline mb-4">Coleção Exclusiva</p>
                            <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                                Livros do Autor
                            </h2>
                        </div>
                        <Link 
                            to="/livros-do-autor" 
                            className="flex items-center gap-2 text-[#D4AF37] font-medium mt-4 md:mt-0 hover:gap-4 transition-all"
                            data-testid="view-all-owner-books"
                        >
                            Ver Todos <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ownerBooks.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* About Owner Section */}
            {owner && (
                <section className="py-24 md:py-32 bg-[#0A1128]" data-testid="about-owner-section">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Image */}
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-full h-full border border-[#D4AF37]/30"></div>
                                <img 
                                    src={owner.avatar_url || 'https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/8tlrve9z_0000.PNG'}
                                    alt={owner.name}
                                    className="w-full h-auto relative z-10"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <p className="overline text-[#D4AF37] mb-4">Conheça o Autor</p>
                                <h2 className="font-heading text-4xl md:text-5xl text-[#FDFBF7] mb-6">
                                    {owner.name}
                                </h2>
                                <p className="text-lg text-[#FDFBF7]/80 leading-relaxed mb-8">
                                    {owner.bio}
                                </p>
                                <Link to="/historia" className="btn-gold" data-testid="read-story-btn">
                                    Ler Minha História
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-24 md:py-32 bg-[#EAE6D9]" data-testid="features-section">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <p className="overline mb-4">Por Que a Ver e Ler</p>
                        <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                            Uma Experiência Literária Única
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="boutique-card text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <BookOpen className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Curadoria Exclusiva</h3>
                            <p className="text-[#4A4A4A] text-sm">
                                Cada livro passa por nossa análise pessoal antes de entrar na loja.
                            </p>
                        </div>

                        <div className="boutique-card text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <Users className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Comunidade de Autores</h3>
                            <p className="text-[#4A4A4A] text-sm">
                                Um marketplace onde autores independentes podem brilhar.
                            </p>
                        </div>

                        <div className="boutique-card text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <Award className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Selo de Qualidade</h3>
                            <p className="text-[#4A4A4A] text-sm">
                                Livros aprovados recebem nosso selo de recomendação.
                            </p>
                        </div>

                        <div className="boutique-card text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <PenTool className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Mentoria Literária</h3>
                            <p className="text-[#4A4A4A] text-sm">
                                Apoiamos novos autores em sua jornada de publicação.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marketplace Preview */}
            {marketplaceBooks.length > 0 && (
                <section className="py-24 md:py-32 bg-[#F4F1EA]" data-testid="marketplace-preview-section">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                            <div>
                                <p className="overline mb-4">Mercado de Autores</p>
                                <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                                    Descubra Novos Talentos
                                </h2>
                            </div>
                            <Link 
                                to="/marketplace" 
                                className="flex items-center gap-2 text-[#D4AF37] font-medium mt-4 md:mt-0 hover:gap-4 transition-all"
                                data-testid="view-marketplace"
                            >
                                Ver Mercado <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {marketplaceBooks.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-[#0A1128] relative overflow-hidden" data-testid="cta-section">
                <div className="absolute inset-0 opacity-10">
                    <img 
                        src="https://images.pexels.com/photos/35893470/pexels-photo-35893470.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-3xl mx-auto px-6 md:px-12 text-center relative z-10">
                    <p className="overline text-[#D4AF37] mb-4">Realize Seu Sonho</p>
                    <h2 className="font-heading text-4xl md:text-5xl text-[#FDFBF7] mb-6">
                        Tem Dúvidas Sobre Como Publicar Seu Livro?
                    </h2>
                    <p className="text-lg text-[#FDFBF7]/80 mb-8">
                        Fale com nossa equipe e realize o seu sonho de se tornar um autor publicado.
                    </p>
                    <Link to="/publicar" className="btn-gold" data-testid="start-publishing-btn">
                        Quero Publicar Meu Livro
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
