import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const OwnerBooks = () => {
    const [books, setBooks] = useState([]);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ownerRes, booksRes] = await Promise.all([
                    axios.get(`${API}/owner`),
                    axios.get(`${API}/books?owner_only=true`)
                ]);
                setOwner(ownerRes.data);
                setBooks(booksRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="pt-20 min-h-screen" data-testid="owner-books-page">
            {/* Hero */}
            <section className="bg-[#0A1128] py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="overline text-[#D4AF37] mb-4">Coleção Exclusiva</p>
                    <h1 className="font-heading text-5xl md:text-6xl text-[#FDFBF7] mb-6">
                        Meus Livros
                    </h1>
                    <p className="text-lg text-[#FDFBF7]/70 max-w-2xl">
                        Uma seleção cuidadosa de obras que refletem minha jornada como escritor. 
                        Cada livro é uma parte da minha alma compartilhada com você.
                    </p>
                </div>
            </section>

            {/* Books Grid */}
            <section className="py-24 bg-[#F4F1EA]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="spinner"></div>
                        </div>
                    ) : books.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {books.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-[#4A4A4A]">Nenhum livro encontrado.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default OwnerBooks;
