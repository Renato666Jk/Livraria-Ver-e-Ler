import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const PublishBook = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        synopsis: '',
        message: ''
    });

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${API}/genres`);
                setGenres(response.data);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('Faça login para enviar sua submissão');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API}/submissions`, formData, { withCredentials: true });
            toast.success('Submissão enviada com sucesso! Entraremos em contato em breve.');
            setFormData({ title: '', synopsis: '', message: '' });
        } catch (error) {
            const message = error.response?.data?.detail || 'Erro ao enviar submissão';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen" data-testid="publish-page">
            {/* Hero */}
            <section className="bg-[#0A1128] py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img 
                        src="https://images.pexels.com/photos/35893470/pexels-photo-35893470.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
                    <p className="overline text-[#D4AF37] mb-4">Realize Seu Sonho</p>
                    <h1 className="font-heading text-5xl md:text-6xl text-[#FDFBF7] mb-6">
                        Publicar Meu Livro
                    </h1>
                    <p className="text-lg text-[#FDFBF7]/70">
                        Submeta seu manuscrito para análise e dê o primeiro passo 
                        para se tornar um autor publicado na Livraria Ver e Ler.
                    </p>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 bg-[#EAE6D9]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h2 className="font-heading text-3xl text-[#0A1128] text-center mb-12">
                        Como Funciona
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37] bg-white">
                                <span className="font-heading text-2xl text-[#D4AF37]">1</span>
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Submeta seu Manuscrito</h3>
                            <p className="text-[#4A4A4A]">Preencha o formulário com informações sobre sua obra.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37] bg-white">
                                <span className="font-heading text-2xl text-[#D4AF37]">2</span>
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Análise e Mentoria</h3>
                            <p className="text-[#4A4A4A]">Nossa equipe avalia e fornece feedback personalizado.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#D4AF37] bg-white">
                                <span className="font-heading text-2xl text-[#D4AF37]">3</span>
                            </div>
                            <h3 className="font-heading text-xl text-[#0A1128] mb-3">Publicação</h3>
                            <p className="text-[#4A4A4A]">Após aprovação, seu livro entra em nossa loja com selo de qualidade.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 bg-[#F4F1EA]">
                <div className="max-w-2xl mx-auto px-6 md:px-12">
                    <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20">
                        <div className="text-center mb-8">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" strokeWidth={1.5} />
                            <h2 className="font-heading text-3xl text-[#0A1128] mb-2">
                                Formulário de Submissão
                            </h2>
                            <p className="text-[#4A4A4A]">
                                Conte-nos sobre sua obra literária
                            </p>
                        </div>

                        {!user && (
                            <div className="mb-8 p-4 bg-[#EAE6D9] flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-[#C5A059]" />
                                <p className="text-sm text-[#4A4A4A]">
                                    Você precisa estar logado para enviar uma submissão. 
                                    <a href="/login" className="text-[#D4AF37] ml-1 hover:underline">Fazer login</a>
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" data-testid="submission-form">
                            <div>
                                <label className="block text-sm text-[#4A4A4A] mb-2">Título do Livro *</label>
                                <input 
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="O título da sua obra"
                                    required
                                    data-testid="title-input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#4A4A4A] mb-2">Sinopse *</label>
                                <textarea 
                                    value={formData.synopsis}
                                    onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                                    className="w-full px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none resize-none h-40"
                                    placeholder="Descreva sua história em poucas palavras..."
                                    required
                                    data-testid="synopsis-input"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#4A4A4A] mb-2">Mensagem para o Autor (opcional)</label>
                                <textarea 
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none resize-none h-32"
                                    placeholder="Conte um pouco sobre você e sua jornada como escritor..."
                                    data-testid="message-input"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading || !user}
                                className="w-full btn-gold flex items-center justify-center gap-2"
                                data-testid="submit-btn"
                            >
                                {loading ? (
                                    <div className="spinner"></div>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Enviar Submissão
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-[#D4AF37]">
                <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                    <h2 className="font-heading text-3xl text-[#0A1128] mb-4">
                        Dúvidas sobre o Processo?
                    </h2>
                    <p className="text-[#0A1128]/70 mb-6">
                        Entre em contato conosco pelo email contato@vereler.com
                    </p>
                </div>
            </section>
        </div>
    );
};

export default PublishBook;
