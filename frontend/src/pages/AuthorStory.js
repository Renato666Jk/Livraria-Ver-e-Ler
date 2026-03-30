import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Heart, Star, GraduationCap, Users, Globe } from 'lucide-react';
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
            year: '20+ Anos',
            title: 'Palestrante e Educador',
            description: 'Mais de 20 anos de experiência como palestrante, atuando com dedicação à cultura, à educação e à transformação social.'
        },
        {
            year: 'Academia',
            title: 'Membro Imortal da ALB-RS',
            description: 'Membro imortal da Academia Letras do Brasil-RS e do Partenon Literário, entre outras agremiações literárias.'
        },
        {
            year: 'Formação',
            title: 'Professor e Pesquisador',
            description: 'Professor de Teologia e graduando em Filosofia. Consultor editorial e agente cultural.'
        },
        {
            year: 'Política Cultural',
            title: 'Coordenador Adjunto',
            description: 'Coordenador adjunto do colegiado setorial do livro, literatura, leitura e bibliotecas do RS. Sócio fundador da Câmara L.L.'
        },
        {
            year: 'Publicação',
            title: 'Núcleo do Conhecimento',
            description: 'Autor do capítulo científico "Viagem no Tempo" publicado na Revista Científica Multidisciplinar Núcleo do Conhecimento.'
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
                            <p className="overline text-[#D4AF37] mb-4">Um Pouco Sobre Mim</p>
                            <h1 className="font-heading text-5xl md:text-6xl text-[#FDFBF7] mb-6">
                                Sandro Gonçalves
                            </h1>
                            <p className="text-xl text-[#FDFBF7]/80 mb-4 font-heading italic">
                                "Durma com Sonhos, Acorde com Planos"
                            </p>
                            <p className="text-lg text-[#FDFBF7]/70 leading-relaxed">
                                Escritor, ensaísta e investigador brasileiro, autor de obras nas áreas de literatura, filosofia e psicologia.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Biography */}
            <section className="py-20 md:py-28 bg-[#F4F1EA]">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <div className="prose prose-lg max-w-none">
                        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                            <strong className="text-[#0A1128]">Sandro Gonçalves</strong> é escritor, ensaísta e investigador brasileiro, 
                            autor de obras nas áreas de literatura, filosofia e psicologia. É autor do livro 
                            <em className="text-[#D4AF37]"> "Muito Além do que Seus Olhos Veem"</em> e do capítulo científico 
                            <em> "Viagem no Tempo"</em>, publicado na Revista Científica Multidisciplinar Núcleo do Conhecimento.
                        </p>

                        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                            Com mais de <strong className="text-[#0A1128]">20 anos de experiência como palestrante</strong>, 
                            Sandro atua com dedicação à cultura, à educação e à transformação social. 
                            É <strong className="text-[#0A1128]">membro imortal da Academia Letras do Brasil-RS</strong> e do 
                            Partenon Literário, entre outras agremiações.
                        </p>

                        <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                            <strong className="text-[#0A1128]">Professor de Teologia e graduando em Filosofia</strong>, 
                            Sandro é também consultor editorial, agente cultural e coordenador adjunto do colegiado setorial 
                            do livro, literatura, leitura e bibliotecas do RS. É sócio fundador da Câmara L.L, 
                            contribuindo ativamente para o fomento da leitura e da produção literária.
                        </p>

                        <p className="text-lg text-[#4A4A4A] leading-relaxed">
                            Um de seus artigos científicos, o capítulo 11 de seu livro, foi publicado na revista científica 
                            "Núcleo do Conhecimento", ampliando seu reconhecimento como pesquisador.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-16 bg-[#D4AF37]">
                <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                    <p className="font-heading text-2xl md:text-3xl text-[#0A1128] italic">
                        "O futuro se constrói pelas escolhas que fazemos diariamente. 
                        Meu compromisso com a transformação através da cultura e da literatura é o que move minha trajetória."
                    </p>
                </div>
            </section>

            {/* Books Section */}
            <section className="py-20 md:py-28 bg-[#EAE6D9]">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <p className="overline mb-4">Obras Publicadas</p>
                        <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                            Livros que Transformam Vidas
                        </h2>
                    </div>

                    <div className="space-y-12">
                        {/* Book 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-1">
                                <img 
                                    src="https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/1zr252gv_111.PNG"
                                    alt="Muito Além do que Seus Olhos Veem"
                                    className="w-full max-w-xs mx-auto shadow-xl"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-heading text-2xl text-[#0A1128] mb-4">
                                    Muito Além do que Seus Olhos Veem
                                </h3>
                                <p className="text-[#4A4A4A] leading-relaxed mb-4">
                                    Uma obra que combina teologia, filosofia, psicologia e espiritualidade. 
                                    Disponível em <strong className="text-[#D4AF37]">180 países</strong>, 
                                    influenciou leitores em escolas, empresas e instituições no Brasil e no exterior.
                                </p>
                                <div className="flex items-center gap-2 text-[#D4AF37]">
                                    <Globe className="w-5 h-5" />
                                    <span className="text-sm font-medium">Alcance internacional</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#D4AF37]/30"></div>

                        {/* Book 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-1 md:order-2">
                                <img 
                                    src="https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/gdbxtfhg_qq.PNG"
                                    alt="Você Sabia? Vencendo a Ansiedade"
                                    className="w-full max-w-xs mx-auto shadow-xl"
                                />
                            </div>
                            <div className="md:col-span-2 md:order-1">
                                <h3 className="font-heading text-2xl text-[#0A1128] mb-4">
                                    VOCÊ SABIA? Vencendo a Ansiedade!
                                </h3>
                                <p className="text-[#4A4A4A] leading-relaxed mb-4">
                                    Aborda fobias e oferece insights para superar a ansiedade, 
                                    incentivando os leitores a enfrentarem seus medos com coragem.
                                </p>
                                <div className="flex items-center gap-2 text-[#D4AF37]">
                                    <Heart className="w-5 h-5" />
                                    <span className="text-sm font-medium">Saúde emocional</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-[#D4AF37]/30"></div>

                        {/* Book 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                            <div className="md:col-span-1">
                                <img 
                                    src="https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/2nj7ucv4_444444.PNG"
                                    alt="Além do Tempo"
                                    className="w-full max-w-xs mx-auto shadow-xl"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="font-heading text-2xl text-[#0A1128] mb-4">
                                    Além do Tempo
                                </h3>
                                <p className="text-[#4A4A4A] leading-relaxed mb-4">
                                    A Jornada de Charlotte em Busca do Amor Perdido. 
                                    Um romance envolvente que atravessa décadas, contando a história de um amor que desafia o tempo.
                                </p>
                                <div className="flex items-center gap-2 text-[#D4AF37]">
                                    <BookOpen className="w-5 h-5" />
                                    <span className="text-sm font-medium">Romance literário</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Other Works */}
                    <div className="mt-16 p-8 bg-white border border-[#D4AF37]/20">
                        <h3 className="font-heading text-xl text-[#0A1128] mb-4">Outras Obras e Participações</h3>
                        <ul className="space-y-3 text-[#4A4A4A]">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></span>
                                <span><strong>"Adivinha o Quanto Eu Gosto de Você"</strong> - Voltado para o público infanto-juvenil, explora a arte de fazer amigos.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></span>
                                <span><strong>"Mentes em Harmonia"</strong> - Antologia ao lado de 23 especialistas em saúde emocional.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></span>
                                <span><strong>"Machado em Palavras"</strong> - Uma homenagem ao grande Machado de Assis.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"></span>
                                <span><strong>"Razões e Sentimentos"</strong> - Coletânea em homenagem à presidente de honra da ALB-RS, Adélia.</span>
                            </li>
                        </ul>
                    </div>
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
                                data-testid={`timeline-event-${index}`}
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
            <section className="py-24 md:py-32 bg-[#0A1128]" data-testid="achievements-section">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <p className="overline text-[#D4AF37] mb-4">Conquistas</p>
                        <h2 className="font-heading text-4xl md:text-5xl text-[#FDFBF7]">
                            Números que Inspiram
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center p-8 border border-[#D4AF37]/30">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#FDFBF7] mb-2">180</p>
                            <p className="text-[#FDFBF7]/70">Países Alcançados</p>
                        </div>

                        <div className="text-center p-8 border border-[#D4AF37]/30">
                            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#FDFBF7] mb-2">20+</p>
                            <p className="text-[#FDFBF7]/70">Anos de Experiência</p>
                        </div>

                        <div className="text-center p-8 border border-[#D4AF37]/30">
                            <Award className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#FDFBF7] mb-2">ALB-RS</p>
                            <p className="text-[#FDFBF7]/70">Membro Imortal</p>
                        </div>

                        <div className="text-center p-8 border border-[#D4AF37]/30">
                            <Users className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <p className="font-heading text-4xl text-[#FDFBF7] mb-2">1000+</p>
                            <p className="text-[#FDFBF7]/70">Vidas Transformadas</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Event Photo Section */}
            <section className="py-24 md:py-32 bg-[#EAE6D9]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="overline mb-4">Atuação Cultural</p>
                            <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128] mb-6">
                                Eventos e Projetos
                            </h2>
                            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
                                Atuante em saraus, eventos culturais e projetos filantrópicos, Sandro acredita que 
                                o futuro se constrói pelas escolhas que fazemos diariamente. Seu compromisso com 
                                a transformação através da cultura e da literatura é o que move sua trajetória.
                            </p>
                            <a 
                                href="https://loja.infinitepay.io/ver_ler" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-gold"
                            >
                                Visitar a Loja
                            </a>
                        </div>
                        <div className="relative">
                            <img 
                                src="https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/t1b3l3sf_6666.PNG"
                                alt="Evento literário"
                                className="w-full h-auto shadow-xl"
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
