import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Heart, Star } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const AuthorStory = () => {
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await axios.get(`${API}/owner`);
                setOwner(response.data);
            } catch (error) {
                console.error('Error fetching owner:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOwner();
    }, []);

    const timelineEvents = [
        {
            year: '2010',
            title: 'O Início da Jornada',
            description: 'Começou a escrever seus primeiros textos, descobrindo uma paixão pela literatura e pela arte de contar histórias.'
        },
        {
            year: '2015',
            title: 'Primeiro Livro Publicado',
            description: 'Lançou seu primeiro livro "Você Sabia? Vencendo a Ansiedade", ajudando milhares de pessoas a encontrar paz interior.'
        },
        {
            year: '2018',
            title: 'Expansão Literária',
            description: 'Publicou "Além do Tempo", um romance envolvente que atravessa décadas contando uma história de amor atemporal.'
        },
        {
            year: '2021',
            title: 'Muito Além do Que Seus Olhos Veem',
            description: 'Lançou sua obra mais aclamada, revelando 7 chaves para transformação pessoal e espiritual.'
        },
        {
            year: '2024',
            title: 'Livraria Ver e Ler',
            description: 'Fundou a Livraria Ver e Ler, criando um espaço para conectar leitores com histórias extraordinárias e apoiar novos autores.'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="pt-20" data-testid="author-story-page">
            {/* Hero Section */}
            <section className="bg-[#0A1128] py-24 md:py-32" data-testid="story-hero">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="relative order-2 lg:order-1">
                            <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#D4AF37]/30"></div>
                            <img 
                                src="https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/8tlrve9z_0000.PNG"
                                alt="Sandro Gonçalves"
                                className="w-full h-auto relative z-10"
                            />
                        </div>

                        {/* Content */}
                        <div className="order-1 lg:order-2">
                            <p className="overline text-[#D4AF37] mb-4">A Minha História</p>
                            <h1 className="font-heading text-5xl md:text-6xl text-[#FDFBF7] mb-6">
                                {owner?.name || 'Sandro Gonçalves'}
                            </h1>
                            <p className="text-xl text-[#FDFBF7]/80 mb-4 font-heading italic">
                                "Durma com Sonhos, Acorde com Planos"
                            </p>
                            <p className="text-lg text-[#FDFBF7]/70 leading-relaxed">
                                {owner?.bio || 'Escritor, mentor literário e fundador da Livraria Ver e Ler.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-16 bg-[#D4AF37]">
                <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                    <p className="font-heading text-2xl md:text-3xl text-[#0A1128] italic">
                        "Cada livro que escrevo é uma parte da minha alma compartilhada com o mundo. 
                        Minha missão é inspirar vidas através das palavras."
                    </p>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 md:py-32 bg-[#F4F1EA]" data-testid="timeline-section">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <p className="overline mb-4">Trajetória</p>
                        <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                            Uma Jornada de Transformação
                        </h2>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Line */}
                        <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-[#D4AF37]/30"></div>

                        {timelineEvents.map((event, index) => (
                            <div 
                                key={event.year}
                                className={`relative pl-12 md:pl-0 pb-16 last:pb-0 md:flex ${
                                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}
                                data-testid={`timeline-event-${event.year}`}
                            >
                                {/* Node */}
                                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-2 w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-[#F4F1EA]"></div>

                                {/* Content */}
                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                                    <span className="text-[#D4AF37] font-heading text-2xl font-bold">{event.year}</span>
                                    <h3 className="font-heading text-xl text-[#0A1128] mt-2 mb-3">{event.title}</h3>
                                    <p className="text-[#4A4A4A]">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements Section */}
            <section className="py-24 md:py-32 bg-[#EAE6D9]" data-testid="achievements-section">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <p className="overline mb-4">Conquistas</p>
                        <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                            Números que Inspiram
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="boutique-card text-center">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#0A1128] mb-2">3+</p>
                            <p className="text-[#4A4A4A]">Livros Publicados</p>
                        </div>

                        <div className="boutique-card text-center">
                            <Heart className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#0A1128] mb-2">10k+</p>
                            <p className="text-[#4A4A4A]">Vidas Transformadas</p>
                        </div>

                        <div className="boutique-card text-center">
                            <Award className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#0A1128] mb-2">5+</p>
                            <p className="text-[#4A4A4A]">Prêmios Literários</p>
                        </div>

                        <div className="boutique-card text-center">
                            <Star className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#0A1128] mb-2">4.8</p>
                            <p className="text-[#4A4A4A]">Avaliação Média</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Photo Section */}
            <section className="py-24 md:py-32 bg-[#0A1128]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="overline text-[#D4AF37] mb-4">Eventos</p>
                            <h2 className="font-heading text-4xl md:text-5xl text-[#FDFBF7] mb-6">
                                Celebrando a Literatura
                            </h2>
                            <p className="text-lg text-[#FDFBF7]/70 leading-relaxed mb-8">
                                Participamos de eventos literários, lançamentos de livros e encontros com leitores. 
                                Cada momento é uma oportunidade de compartilhar o amor pela literatura.
                            </p>
                            <Link to="/livros-do-autor" className="btn-gold">
                                Ver Meus Livros
                            </Link>
                        </div>
                        <div className="relative">
                            <img 
                                src="https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/t1b3l3sf_6666.PNG"
                                alt="Evento literário"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-[#F4F1EA]">
                <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
                    <p className="overline mb-4">Vamos Conversar</p>
                    <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128] mb-6">
                        Quer Publicar Seu Livro?
                    </h2>
                    <p className="text-lg text-[#4A4A4A] mb-8">
                        Se você tem um sonho de se tornar autor, adoraria ajudá-lo nessa jornada.
                    </p>
                    <Link to="/publicar" className="btn-primary" data-testid="cta-publish-btn">
                        Quero Publicar Meu Livro
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default AuthorStory;
