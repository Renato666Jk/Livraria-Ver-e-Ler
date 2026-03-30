import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, PenTool, ExternalLink, Sparkles } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const Home = () => {
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    const featuredBooks = [
        {
            id: 1,
            title: "Muito Além do Que Seus Olhos Veem",
            subtitle: "7 chaves para ativar o milagre",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/1zr252gv_111.PNG",
            category: "Espiritualidade"
        },
        {
            id: 2,
            title: "Além do Tempo",
            subtitle: "A Jornada de Charlotte",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/2nj7ucv4_444444.PNG",
            category: "Romance"
        },
        {
            id: 3,
            title: "Você Sabia?",
            subtitle: "Vencendo a Ansiedade",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/gdbxtfhg_qq.PNG",
            category: "Autoajuda"
        },
        {
            id: 4,
            title: "Théo e a Pedra do Poder",
            subtitle: "A Filosofia da Coragem",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/bv9fx6zc_image.png",
            category: "Infanto-Juvenil"
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ownerRes = await axios.get(`${API}/owner`);
                setOwner(ownerRes.data);
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
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-px w-8 bg-[#D4AF37]"></div>
                                <p className="overline text-[#D4AF37]">Bem-vindo à</p>
                            </div>
                            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-[#FDFBF7] leading-tight mb-6">
                                Livraria<br />
                                <span className="text-[#D4AF37]">Ver e Ler</span>
                            </h1>
                            <p className="text-lg text-[#FDFBF7]/80 mb-8 max-w-lg leading-relaxed">
                                Uma jornada literária onde cada página é uma nova descoberta. 
                                Explore nosso acervo exclusivo e conecte-se com histórias que transformam.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/livros-do-autor" className="btn-gold flex items-center justify-center gap-2" data-testid="explore-books-btn">
                                    <span>Explorar Livros</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <a 
                                    href="https://loja.infinitepay.io/ver_ler"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary bg-transparent border-[#FDFBF7] text-[#FDFBF7] hover:bg-[#FDFBF7] hover:text-[#0A1128] flex items-center justify-center gap-2"
                                >
                                    <span>Visitar Loja</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Right - Book Covers */}
                        <div className="hidden lg:flex justify-end items-center gap-6 fade-in-delay-2">
                            <div className="space-y-6">
                                <div className="w-48 transform translate-y-8 shadow-2xl transition-transform hover:-translate-y-0 duration-500">
                                    <img 
                                        src={featuredBooks[0].cover}
                                        alt={featuredBooks[0].title}
                                        className="w-full h-auto"
                                    />
                                </div>
                                <div className="w-48 transform -translate-y-4 shadow-2xl transition-transform hover:-translate-y-8 duration-500">
                                    <img 
                                        src={featuredBooks[1].cover}
                                        alt={featuredBooks[1].title}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                            <div className="w-56 shadow-2xl transform hover:-translate-y-4 transition-transform duration-500">
                                <img 
                                    src={featuredBooks[2].cover}
                                    alt={featuredBooks[2].title}
                                    className="w-full h-auto"
                                />
                            </div>
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

            {/* Featured Books Section */}
            <section className="py-24 md:py-32 bg-[#F4F1EA]" data-testid="owner-books-section">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                                <p className="overline">Coleção Exclusiva</p>
                            </div>
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

                    {/* Books Grid - Vitrine Style */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {featuredBooks.map((book, index) => (
                            <Link 
                                to="/livros-do-autor"
                                key={book.id}
                                className="group"
                                data-testid={`featured-book-${book.id}`}
                            >
                                <div className="relative overflow-hidden mb-4">
                                    <div className="aspect-[3/4] bg-[#EAE6D9]">
                                        <img 
                                            src={book.cover}
                                            alt={book.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 bg-[#0A1128]/90 text-[#D4AF37] px-2 py-1 text-[10px] uppercase tracking-wider font-semibold">
                                        {book.category}
                                    </span>
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-[#0A1128]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-[#D4AF37] text-sm font-medium">Ver Detalhes</span>
                                    </div>
                                </div>
                                <h3 className="font-heading text-base md:text-lg text-[#0A1128] mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                                    {book.title}
                                </h3>
                                <p className="text-xs md:text-sm text-[#D4AF37] italic font-heading">
                                    {book.subtitle}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <a 
                            href="https://loja.infinitepay.io/ver_ler"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 btn-gold"
                        >
                            <span>Adquirir na Loja</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
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
                                    src="https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/8tlrve9z_0000.PNG"
                                    alt={owner.name}
                                    className="w-full h-auto relative z-10"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-px w-8 bg-[#D4AF37]"></div>
                                    <p className="overline text-[#D4AF37]">Conheça o Autor</p>
                                </div>
                                <h2 className="font-heading text-4xl md:text-5xl text-[#FDFBF7] mb-6">
                                    {owner.name}
                                </h2>
                                <p className="text-lg text-[#FDFBF7]/80 leading-relaxed mb-4">
                                    Escritor, ensaísta e investigador brasileiro, autor de obras nas áreas de literatura, filosofia e psicologia.
                                </p>
                                <p className="text-[#FDFBF7]/60 leading-relaxed mb-8">
                                    Com mais de 20 anos de experiência como palestrante, atuando com dedicação à cultura, 
                                    à educação e à transformação social. Membro imortal da Academia Letras do Brasil-RS.
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
                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <BookOpen className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Curadoria Exclusiva</h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                Cada livro é selecionado com cuidado para garantir qualidade e transformação.
                            </p>
                        </div>

                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <Users className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Comunidade de Autores</h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                Um espaço onde autores independentes podem compartilhar suas obras.
                            </p>
                        </div>

                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <Award className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Selo de Qualidade</h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                Livros aprovados recebem nosso selo de recomendação e confiança.
                            </p>
                        </div>

                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <PenTool className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Mentoria Literária</h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                Apoiamos novos autores em sua jornada de publicação e sucesso.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

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
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-px w-12 bg-[#D4AF37]"></div>
                        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                        <div className="h-px w-12 bg-[#D4AF37]"></div>
                    </div>
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
