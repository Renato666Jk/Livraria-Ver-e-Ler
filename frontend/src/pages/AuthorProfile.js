import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, BookOpen, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const AuthorProfile = () => {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await axios.get(`${API}/authors/${id}`);
                setAuthor(response.data);
            } catch (error) {
                console.error('Error fetching author:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthor();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!author) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <p className="text-[#4A4A4A]">Autor não encontrado.</p>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-[#F4F1EA]" data-testid="author-profile-page">
            {/* Breadcrumb */}
            <div className="bg-[#EAE6D9] py-4">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <Link to="/marketplace" className="flex items-center gap-2 text-[#4A4A4A] hover:text-[#D4AF37] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao Mercado
                    </Link>
                </div>
            </div>

            {/* Author Header */}
            <section className="py-16 bg-[#0A1128]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {author.avatar_url ? (
                            <img 
                                src={author.avatar_url}
                                alt={author.name}
                                className="w-32 h-32 rounded-full object-cover border-4 border-[#D4AF37]"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                <User className="w-16 h-16 text-[#0A1128]" strokeWidth={1} />
                            </div>
                        )}
                        <div className="text-center md:text-left">
                            {author.approved && (
                                <span className="seal-badge mb-4 inline-block">Autor Verificado</span>
                            )}
                            <h1 className="font-heading text-4xl text-[#FDFBF7] mb-2">{author.name}</h1>
                            <p className="text-[#FDFBF7]/70">{author.books?.length || 0} livros publicados</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bio */}
            {author.bio && (
                <section className="py-12 bg-[#EAE6D9]">
                    <div className="max-w-4xl mx-auto px-6 md:px-12">
                        <h2 className="font-heading text-2xl text-[#0A1128] mb-4">Sobre o Autor</h2>
                        <p className="text-[#4A4A4A] leading-relaxed">{author.bio}</p>
                    </div>
                </section>
            )}

            {/* Books */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <h2 className="font-heading text-3xl text-[#0A1128] mb-8">Livros de {author.name}</h2>
                    {author.books && author.books.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {author.books.map(book => (
                                <BookCard key={book.id} book={{...book, author_name: author.name}} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[#4A4A4A] py-12">Este autor ainda não publicou livros.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AuthorProfile;
