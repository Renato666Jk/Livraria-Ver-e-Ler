import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const Marketplace = () => {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksRes, authorsRes, genresRes] = await Promise.all([
                    axios.get(`${API}/books`),
                    axios.get(`${API}/authors`),
                    axios.get(`${API}/genres`)
                ]);
                setBooks(booksRes.data);
                setAuthors(authorsRes.data);
                setGenres(genresRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredBooks = books.filter(book => {
        const matchesSearch = !searchQuery || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = !selectedGenre || book.genre === selectedGenre;
        const matchesAuthor = !selectedAuthor || book.author_id === selectedAuthor;
        return matchesSearch && matchesGenre && matchesAuthor;
    });

    return (
        <div className="pt-20 min-h-screen" data-testid="marketplace-page">
            {/* Hero */}
            <section className="bg-[#0A1128] py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="overline text-[#D4AF37] mb-4">Mercado de Autores</p>
                    <h1 className="font-heading text-5xl md:text-6xl text-[#FDFBF7] mb-6">
                        Descubra Novos Talentos
                    </h1>
                    <p className="text-lg text-[#FDFBF7]/70 max-w-2xl">
                        Explore uma coleção diversificada de livros de autores independentes. 
                        Cada obra passou por nossa curadoria de qualidade.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 bg-[#EAE6D9] border-b border-[#D4AF37]/20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" strokeWidth={1.5} />
                            <input 
                                type="text"
                                placeholder="Buscar por título ou autor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                data-testid="search-input"
                            />
                        </div>

                        {/* Genre Filter */}
                        <select 
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="px-4 py-3 bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none min-w-[200px]"
                            data-testid="genre-filter"
                        >
                            <option value="">Todos os Gêneros</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>

                        {/* Author Filter */}
                        <select 
                            value={selectedAuthor}
                            onChange={(e) => setSelectedAuthor(e.target.value)}
                            className="px-4 py-3 bg-white border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none min-w-[200px]"
                            data-testid="author-filter"
                        >
                            <option value="">Todos os Autores</option>
                            {authors.map(author => (
                                <option key={author.id} value={author.id}>{author.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-[#F4F1EA]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Authors Sidebar */}
                        <aside className="lg:col-span-1">
                            <h3 className="font-heading text-xl text-[#0A1128] mb-6">Autores em Destaque</h3>
                            <div className="space-y-4">
                                {authors.slice(0, 5).map(author => (
                                    <Link 
                                        key={author.id}
                                        to={`/autor/${author.id}`}
                                        className="flex items-center gap-3 p-3 bg-white border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-colors"
                                        data-testid={`author-link-${author.id}`}
                                    >
                                        {author.avatar_url ? (
                                            <img 
                                                src={author.avatar_url}
                                                alt={author.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#0A1128] flex items-center justify-center">
                                                <User className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-[#0A1128]">{author.name}</p>
                                            <p className="text-sm text-[#4A4A4A]">{author.book_count} livros</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </aside>

                        {/* Books Grid */}
                        <div className="lg:col-span-3">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="spinner"></div>
                                </div>
                            ) : filteredBooks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredBooks.map(book => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-[#4A4A4A]">Nenhum livro encontrado com os filtros selecionados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Marketplace;
