import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, Users, FileText, MessageSquare, Settings, 
    Plus, Check, X, Clock, Award, Trash2, Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('books');
    const [loading, setLoading] = useState(true);
    
    // Data states
    const [myBooks, setMyBooks] = useState([]);
    const [pendingBooks, setPendingBooks] = useState([]);
    const [pendingAuthors, setPendingAuthors] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [orders, setOrders] = useState([]);
    
    // Form states
    const [showAddBook, setShowAddBook] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        synopsis: '',
        price: '',
        genre: 'ficcao',
        sample_chapter: ''
    });
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        if (!user || (user.role !== 'author' && user.role !== 'owner')) {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [genresRes] = await Promise.all([
                axios.get(`${API}/genres`)
            ]);
            setGenres(genresRes.data);

            // Fetch books
            if (user.role === 'owner') {
                const booksRes = await axios.get(`${API}/books?owner_only=true`);
                setMyBooks(booksRes.data);
                
                const pendingBooksRes = await axios.get(`${API}/owner/pending-books`, { withCredentials: true });
                setPendingBooks(pendingBooksRes.data);
                
                const pendingAuthorsRes = await axios.get(`${API}/owner/pending-authors`, { withCredentials: true });
                setPendingAuthors(pendingAuthorsRes.data);
                
                const ordersRes = await axios.get(`${API}/orders`, { withCredentials: true });
                setOrders(ordersRes.data);
            } else {
                const booksRes = await axios.get(`${API}/books?author_id=${user._id}`);
                setMyBooks(booksRes.data);
            }

            const submissionsRes = await axios.get(`${API}/submissions`, { withCredentials: true });
            setSubmissions(submissionsRes.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/books`, {
                ...newBook,
                price: parseFloat(newBook.price)
            }, { withCredentials: true });
            
            toast.success('Livro adicionado com sucesso!');
            setShowAddBook(false);
            setNewBook({ title: '', synopsis: '', price: '', genre: 'ficcao', sample_chapter: '' });
            fetchData();
        } catch (error) {
            toast.error('Erro ao adicionar livro');
        }
    };

    const handleApproveBook = async (bookId, approved) => {
        try {
            await axios.put(`${API}/owner/approve-book/${bookId}?approved=${approved}`, {}, { withCredentials: true });
            toast.success(approved ? 'Livro aprovado!' : 'Livro rejeitado');
            fetchData();
        } catch (error) {
            toast.error('Erro ao processar aprovação');
        }
    };

    const handleApproveAuthor = async (authorId, approved) => {
        try {
            await axios.put(`${API}/owner/approve-author/${authorId}?approved=${approved}`, {}, { withCredentials: true });
            toast.success(approved ? 'Autor aprovado!' : 'Autor rejeitado');
            fetchData();
        } catch (error) {
            toast.error('Erro ao processar aprovação');
        }
    };

    const handleSubmissionFeedback = async (submissionId, status, approved) => {
        const feedback = prompt('Digite seu feedback:');
        if (!feedback) return;

        try {
            await axios.put(`${API}/submissions/${submissionId}/feedback`, {
                status,
                feedback,
                approved
            }, { withCredentials: true });
            toast.success('Feedback enviado!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao enviar feedback');
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!confirm('Tem certeza que deseja excluir este livro?')) return;
        
        try {
            await axios.delete(`${API}/books/${bookId}`, { withCredentials: true });
            toast.success('Livro excluído!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao excluir livro');
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await axios.put(`${API}/orders/${orderId}/status?status=${status}`, {}, { withCredentials: true });
            toast.success('Status atualizado!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao atualizar status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'books', label: 'Meus Livros', icon: BookOpen },
        ...(user?.role === 'owner' ? [
            { id: 'pending', label: 'Pendentes', icon: Clock },
            { id: 'authors', label: 'Autores', icon: Users },
            { id: 'orders', label: 'Pedidos', icon: FileText }
        ] : []),
        { id: 'submissions', label: 'Submissões', icon: FileText }
    ];

    return (
        <div className="pt-20 min-h-screen bg-[#F4F1EA]" data-testid="dashboard-page">
            {/* Header */}
            <section className="bg-[#0A1128] py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="overline text-[#D4AF37] mb-2">
                        {user?.role === 'owner' ? 'Painel do Dono' : 'Painel do Autor'}
                    </p>
                    <h1 className="font-heading text-4xl text-[#FDFBF7]">
                        Olá, {user?.name}
                    </h1>
                </div>
            </section>

            {/* Tabs */}
            <div className="bg-[#EAE6D9] border-b border-[#D4AF37]/20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeTab === tab.id 
                                        ? 'bg-[#F4F1EA] text-[#0A1128] border-t-2 border-[#D4AF37]' 
                                        : 'text-[#4A4A4A] hover:text-[#0A1128]'
                                }`}
                                data-testid={`tab-${tab.id}`}
                            >
                                <tab.icon className="w-4 h-4" strokeWidth={1.5} />
                                {tab.label}
                                {tab.id === 'pending' && pendingBooks.length > 0 && (
                                    <span className="px-2 py-0.5 bg-[#D4AF37] text-[#0A1128] text-xs rounded-full">
                                        {pendingBooks.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* My Books Tab */}
                    {activeTab === 'books' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="font-heading text-2xl text-[#0A1128]">Meus Livros</h2>
                                <button 
                                    onClick={() => setShowAddBook(true)}
                                    className="btn-gold flex items-center gap-2"
                                    data-testid="add-book-btn"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Livro
                                </button>
                            </div>

                            {/* Add Book Form */}
                            {showAddBook && (
                                <div className="mb-8 p-6 bg-white border border-[#D4AF37]/20">
                                    <h3 className="font-heading text-xl text-[#0A1128] mb-4">Novo Livro</h3>
                                    <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            type="text"
                                            placeholder="Título"
                                            value={newBook.title}
                                            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                            className="px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                            required
                                        />
                                        <input 
                                            type="number"
                                            step="0.01"
                                            placeholder="Preço"
                                            value={newBook.price}
                                            onChange={(e) => setNewBook({...newBook, price: e.target.value})}
                                            className="px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                            required
                                        />
                                        <select 
                                            value={newBook.genre}
                                            onChange={(e) => setNewBook({...newBook, genre: e.target.value})}
                                            className="px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                        >
                                            {genres.map(g => (
                                                <option key={g.id} value={g.id}>{g.name}</option>
                                            ))}
                                        </select>
                                        <div className="md:col-span-2">
                                            <textarea 
                                                placeholder="Sinopse"
                                                value={newBook.synopsis}
                                                onChange={(e) => setNewBook({...newBook, synopsis: e.target.value})}
                                                className="w-full px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none h-24 resize-none"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <textarea 
                                                placeholder="Capítulo de Amostra (opcional)"
                                                value={newBook.sample_chapter}
                                                onChange={(e) => setNewBook({...newBook, sample_chapter: e.target.value})}
                                                className="w-full px-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none h-32 resize-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex gap-4">
                                            <button type="submit" className="btn-gold">Salvar</button>
                                            <button type="button" onClick={() => setShowAddBook(false)} className="btn-secondary">Cancelar</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Books List */}
                            {myBooks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myBooks.map(book => (
                                        <div key={book.id} className="bg-white p-6 border border-[#D4AF37]/20">
                                            <div className="flex gap-4">
                                                {book.cover_url ? (
                                                    <img src={book.cover_url} alt={book.title} className="w-20 h-28 object-cover" />
                                                ) : (
                                                    <div className="w-20 h-28 bg-[#EAE6D9] flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-[#C5A059]" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h3 className="font-heading text-lg text-[#0A1128] mb-1">{book.title}</h3>
                                                    <p className="text-sm text-[#4A4A4A] mb-2">{book.genre}</p>
                                                    <p className="text-[#D4AF37] font-medium">R$ {book.price?.toFixed(2)}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {book.owner_approved ? (
                                                            <span className="flex items-center gap-1 text-xs text-green-600">
                                                                <Award className="w-3 h-3" /> Aprovado
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-xs text-yellow-600">
                                                                <Clock className="w-3 h-3" /> Pendente
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button 
                                                    onClick={() => handleDeleteBook(book.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[#4A4A4A] py-12">Nenhum livro cadastrado ainda.</p>
                            )}
                        </div>
                    )}

                    {/* Pending Books Tab (Owner Only) */}
                    {activeTab === 'pending' && user?.role === 'owner' && (
                        <div>
                            <h2 className="font-heading text-2xl text-[#0A1128] mb-8">Livros Pendentes de Aprovação</h2>
                            {pendingBooks.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingBooks.map(book => (
                                        <div key={book.id} className="bg-white p-6 border border-[#D4AF37]/20 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-heading text-lg text-[#0A1128]">{book.title}</h3>
                                                <p className="text-sm text-[#4A4A4A]">por {book.author_name}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleApproveBook(book.id, true)}
                                                    className="p-2 bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                    data-testid={`approve-book-${book.id}`}
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleApproveBook(book.id, false)}
                                                    className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[#4A4A4A] py-12">Nenhum livro pendente.</p>
                            )}
                        </div>
                    )}

                    {/* Authors Tab (Owner Only) */}
                    {activeTab === 'authors' && user?.role === 'owner' && (
                        <div>
                            <h2 className="font-heading text-2xl text-[#0A1128] mb-8">Autores Pendentes de Aprovação</h2>
                            {pendingAuthors.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingAuthors.map(author => (
                                        <div key={author.id} className="bg-white p-6 border border-[#D4AF37]/20 flex justify-between items-center">
                                            <div>
                                                <h3 className="font-heading text-lg text-[#0A1128]">{author.name}</h3>
                                                <p className="text-sm text-[#4A4A4A]">{author.email}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleApproveAuthor(author.id, true)}
                                                    className="p-2 bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                    data-testid={`approve-author-${author.id}`}
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleApproveAuthor(author.id, false)}
                                                    className="p-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[#4A4A4A] py-12">Nenhum autor pendente.</p>
                            )}
                        </div>
                    )}

                    {/* Orders Tab (Owner Only) */}
                    {activeTab === 'orders' && user?.role === 'owner' && (
                        <div>
                            <h2 className="font-heading text-2xl text-[#0A1128] mb-8">Pedidos</h2>
                            {orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white p-6 border border-[#D4AF37]/20">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-sm text-[#4A4A4A]">Pedido #{order.id.slice(0, 8)}</p>
                                                    <p className="text-sm text-[#4A4A4A]">{order.user_email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-heading text-xl text-[#D4AF37]">
                                                        R$ {order.total?.toFixed(2)}
                                                    </p>
                                                    <span className={`text-xs px-2 py-1 ${
                                                        order.status === 'paid' ? 'bg-green-100 text-green-600' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                                                    className="text-sm btn-gold py-1 px-3"
                                                >
                                                    Marcar Pago
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                                    className="text-sm btn-secondary py-1 px-3"
                                                >
                                                    Enviado
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[#4A4A4A] py-12">Nenhum pedido ainda.</p>
                            )}
                        </div>
                    )}

                    {/* Submissions Tab */}
                    {activeTab === 'submissions' && (
                        <div>
                            <h2 className="font-heading text-2xl text-[#0A1128] mb-8">
                                {user?.role === 'owner' ? 'Submissões para Análise' : 'Minhas Submissões'}
                            </h2>
                            {submissions.length > 0 ? (
                                <div className="space-y-4">
                                    {submissions.map(sub => (
                                        <div key={sub.id} className="bg-white p-6 border border-[#D4AF37]/20">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-heading text-lg text-[#0A1128]">{sub.title}</h3>
                                                    {user?.role === 'owner' && (
                                                        <p className="text-sm text-[#4A4A4A]">por {sub.author_name}</p>
                                                    )}
                                                    <p className="text-sm text-[#4A4A4A] mt-2 line-clamp-2">{sub.synopsis}</p>
                                                </div>
                                                <span className={`text-xs px-2 py-1 ${
                                                    sub.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                    sub.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                    {sub.status}
                                                </span>
                                            </div>
                                            {sub.feedback && (
                                                <div className="mt-4 p-4 bg-[#EAE6D9] border-l-4 border-[#D4AF37]">
                                                    <p className="text-sm text-[#4A4A4A]"><strong>Feedback:</strong> {sub.feedback}</p>
                                                </div>
                                            )}
                                            {user?.role === 'owner' && sub.status === 'pending' && (
                                                <div className="flex gap-2 mt-4">
                                                    <button 
                                                        onClick={() => handleSubmissionFeedback(sub.id, 'approved', true)}
                                                        className="text-sm btn-gold py-1 px-3"
                                                    >
                                                        Aprovar
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSubmissionFeedback(sub.id, 'rejected', false)}
                                                        className="text-sm btn-secondary py-1 px-3"
                                                    >
                                                        Rejeitar
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-[#4A4A4A] py-12">Nenhuma submissão encontrada.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
