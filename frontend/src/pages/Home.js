import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, PenTool, ExternalLink, Sparkles } from 'lucide-react';
import axios from 'axios';
import BookCarousel3D from '../components/BookCarousel3D';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const Home = () => {
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

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
            {/* Hero Section with 3D Carousel */}
            <section className="relative min-h-screen bg-[#0A1128] overflow-hidden" data-testid="hero-section">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Gold Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A1128] to-transparent z-10"></div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-160px)]">
                        {/* Left Content */}
                        <div className="text-center lg:text-left order-2 lg:order-1">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                                <div className="h-px w-8 bg-[#D4AF37]"></div>
                                <p className="text-[#D4AF37] text-xs uppercase tracking-[0.3em] font-medium">
                                    Bem-vindo à
                                </p>
                            </div>
                            
                            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#FDFBF7] leading-[1.1] mb-6">
                                Livraria<br />
                                <span className="text-[#D4AF37]">Ver e Ler</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-[#FDFBF7]/70 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                Uma jornada literária onde cada página é uma nova descoberta. 
                                Explore nosso acervo exclusivo e conecte-se com histórias que transformam.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link 
                                    to="/livros-do-autor" 
                                    className="btn-gold flex items-center justify-center gap-2 text-base px-8 py-4"
                                    data-testid="explore-books-btn"
                                >
                                    <span>Explorar Livros</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <a 
                                    href="https://loja.infinitepay.io/ver_ler"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-8 py-4 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1128] transition-all text-base uppercase tracking-wider font-medium"
                                >
                                    <span>Visitar Loja</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-[#D4AF37]/20">
                                <div className="text-center">
                                    <p className="font-heading text-3xl text-[#D4AF37]">8+</p>
                                    <p className="text-xs text-[#FDFBF7]/50 uppercase tracking-wider">Livros</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-heading text-3xl text-[#D4AF37]">180</p>
                                    <p className="text-xs text-[#FDFBF7]/50 uppercase tracking-wider">Países</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-heading text-3xl text-[#D4AF37]">20+</p>
                                    <p className="text-xs text-[#FDFBF7]/50 uppercase tracking-wider">Anos</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - 3D Book Carousel */}
                        <div className="order-1 lg:order-2 flex items-center justify-center">
                            <BookCarousel3D />
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <div className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-3 bg-[#D4AF37] rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* About Owner Section */}
            {owner && (
                <section className="py-24 md:py-32 bg-[#F4F1EA]" data-testid="about-owner-section">
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
                                    <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-medium">Conheça o Autor</p>
                                </div>
                                <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128] mb-6">
                                    {owner.name}
                                </h2>
                                <p className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
                                    Escritor, ensaísta e investigador brasileiro, autor de obras nas áreas de literatura, filosofia e psicologia.
                                </p>
                                <p className="text-[#4A4A4A]/80 leading-relaxed mb-8">
                                    Com mais de 20 anos de experiência como palestrante, atuando com dedicação à cultura, 
                                    à educação e à transformação social. Membro imortal da Academia Letras do Brasil-RS.
                                </p>
                                <Link to="/historia" className="btn-primary" data-testid="read-story-btn">
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
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="h-px w-12 bg-[#D4AF37]"></div>
                            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                            <div className="h-px w-12 bg-[#D4AF37]"></div>
                        </div>
                        <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-medium mb-4">Por Que a Ver e Ler</p>
                        <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                            Uma Experiência Literária Única
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <BookOpen className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Curadoria Exclusiva</h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                Cada livro é selecionado com cuidado para garantir qualidade e transformação.
                            </p>
                        </div>

                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <Users className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Comunidade de Autores</h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                Um espaço onde autores independentes podem compartilhar suas obras.
                            </p>
                        </div>

                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37]">
                                <Award className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Selo de Qualidade</h3>
                            <p className="text-[#4A4A4A] text-sm leading-relaxed">
                                Livros aprovados recebem nosso selo de recomendação e confiança.
                            </p>
                        </div>

                        <div className="bg-white p-8 border border-[#D4AF37]/20 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
                    <p className="text-[#D4AF37] text-xs uppercase tracking-[0.2em] font-medium mb-4">Realize Seu Sonho</p>
                    <h2 className="font-heading text-4xl md:text-5xl text-[#FDFBF7] mb-6">
                        Tem Dúvidas Sobre Como Publicar Seu Livro?
                    </h2>
                    <p className="text-lg text-[#FDFBF7]/80 mb-8">
                        Fale com nossa equipe e realize o seu sonho de se tornar um autor publicado.
                    </p>
                    <Link to="/publicar" className="btn-gold text-base px-10 py-4" data-testid="start-publishing-btn">
                        Quero Publicar Meu Livro
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
