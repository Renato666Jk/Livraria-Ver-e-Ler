import { useState } from 'react';
import { BookOpen, ExternalLink, Sparkles } from 'lucide-react';

const OwnerBooks = () => {
    const [selectedBook, setSelectedBook] = useState(null);

    const books = [
        {
            id: 1,
            title: "Muito Além do Que Seus Olhos Veem",
            subtitle: "7 chaves para ativar o milagre",
            author: "Sandro Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/1zr252gv_111.PNG",
            category: "Espiritualidade",
            description: "Uma obra que combina teologia, filosofia, psicologia e espiritualidade. Disponível em 180 países, influenciou leitores em escolas, empresas e instituições no Brasil e no exterior.",
            highlight: true
        },
        {
            id: 2,
            title: "Além do Tempo",
            subtitle: "A Jornada de Charlotte em Busca do Amor Perdido",
            author: "Sandro Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/2nj7ucv4_444444.PNG",
            category: "Romance",
            description: "Um romance envolvente que atravessa décadas, contando a história de um amor que desafia o tempo e as circunstâncias."
        },
        {
            id: 3,
            title: "Você Sabia? Vencendo a Ansiedade",
            subtitle: "Descubra como controlar seus pensamentos",
            author: "Sandro Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/gdbxtfhg_qq.PNG",
            category: "Autoajuda",
            description: "Aborda fobias e oferece insights para superar a ansiedade, incentivando os leitores a enfrentarem seus medos com coragem."
        },
        {
            id: 4,
            title: "Théo e a Pedra do Poder",
            subtitle: "A Filosofia da Coragem",
            author: "Sandro Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/bv9fx6zc_image.png",
            category: "Infanto-Juvenil",
            description: "Uma aventura mágica para o público infanto-juvenil que ensina sobre coragem, família e o poder interior que todos carregamos."
        },
        {
            id: 5,
            title: "Lições que Herdei",
            subtitle: "Vozes de Minha Mãe",
            author: "Sandro Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/fq9wgk7k_image.png",
            category: "Memórias",
            description: "Um presente para você e sua mãe. Um livro para guardar e para passar adiante. Histórias que fazem morada em quem lê."
        },
        {
            id: 6,
            title: "Lições que Herdei",
            subtitle: "Fragmentos de Sabedoria e Amor",
            author: "Uiára Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/ckszp84j_image.png",
            category: "Memórias",
            description: "Um presente para você e seu pai. Um livro para guardar e para passar adiante. Histórias que fazem morada em quem lê."
        },
        {
            id: 7,
            title: "Pré-Ocupação",
            subtitle: "O mundo exige, o agora convida",
            author: "Sandro Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/8duiy6dc_image.png",
            category: "Reflexões",
            description: "Vire o tempo de cabeça para baixo. Para entender tudo, é preciso mudar a perspectiva. Uma obra provocativa sobre o presente."
        },
        {
            id: 8,
            title: "Vai Passar",
            subtitle: "Esta leitura vai promover mudanças profundas",
            author: "Sandro Gonçalves",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/528ld8gr_image.png",
            category: "Motivacional",
            description: "Este livro é um presente para quem o oferece e para quem o recebe. Prefáciado pelo Pastor Leandro Barbosa e inclui reflexões do Psicólogo Dr. Roberto Corrêa."
        }
    ];

    return (
        <div className="pt-20 min-h-screen bg-[#F4F1EA]" data-testid="owner-books-page">
            {/* Hero Section */}
            <section className="bg-[#0A1128] py-24 md:py-32 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
                
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="h-px w-12 bg-[#D4AF37]"></div>
                            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                            <div className="h-px w-12 bg-[#D4AF37]"></div>
                        </div>
                        <p className="overline text-[#D4AF37] mb-4">Coleção Exclusiva</p>
                        <h1 className="font-heading text-5xl md:text-7xl text-[#FDFBF7] mb-6 leading-tight">
                            Livros do Autor
                        </h1>
                        <p className="text-lg md:text-xl text-[#FDFBF7]/70 leading-relaxed mb-8">
                            Uma seleção cuidadosa de obras que refletem uma jornada de transformação, 
                            conhecimento e inspiração. Cada livro é uma parte da alma compartilhada com você.
                        </p>
                        <a 
                            href="https://loja.infinitepay.io/ver_ler"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 btn-gold"
                            data-testid="visit-store-btn"
                        >
                            <span>Visitar a Loja</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Featured Book */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-[#0A1128] to-[#F4F1EA]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="bg-white border border-[#D4AF37]/20 p-8 md:p-12 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-[#D4AF37]/10 transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                                <img 
                                    src={books[0].cover}
                                    alt={books[0].title}
                                    className="relative z-10 w-full max-w-sm mx-auto shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-[#0A1128] px-4 py-2 font-bold text-xs uppercase tracking-wider z-20">
                                    Destaque
                                </div>
                            </div>
                            <div>
                                <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 text-xs uppercase tracking-wider font-semibold mb-4">
                                    {books[0].category}
                                </span>
                                <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128] mb-3">
                                    {books[0].title}
                                </h2>
                                <p className="text-xl text-[#D4AF37] font-heading italic mb-4">
                                    {books[0].subtitle}
                                </p>
                                <p className="text-sm text-[#4A4A4A] mb-6">
                                    por <span className="text-[#0A1128] font-medium">{books[0].author}</span>
                                </p>
                                <p className="text-[#4A4A4A] leading-relaxed mb-8">
                                    {books[0].description}
                                </p>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center gap-2 text-[#D4AF37]">
                                        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                            <BookOpen className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">180 países</span>
                                    </div>
                                </div>
                                <a 
                                    href="https://loja.infinitepay.io/ver_ler"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 btn-primary"
                                >
                                    <span>Adquirir na Loja</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Books Grid */}
            <section className="py-20 md:py-28 bg-[#F4F1EA]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <p className="overline mb-4">Biblioteca Completa</p>
                        <h2 className="font-heading text-4xl md:text-5xl text-[#0A1128]">
                            Todas as Obras
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {books.slice(1).map((book, index) => (
                            <div 
                                key={book.id}
                                className="group cursor-pointer"
                                onClick={() => setSelectedBook(book)}
                                data-testid={`book-${book.id}`}
                            >
                                {/* Book Cover */}
                                <div className="relative mb-6 overflow-hidden bg-[#EAE6D9]">
                                    <div className="aspect-[3/4] relative">
                                        <img 
                                            src={book.cover}
                                            alt={book.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-[#0A1128]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="text-center p-6">
                                                <p className="text-[#FDFBF7] text-sm leading-relaxed line-clamp-4">
                                                    {book.description}
                                                </p>
                                                <a 
                                                    href="https://loja.infinitepay.io/ver_ler"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-2 mt-4 text-[#D4AF37] text-sm font-medium hover:text-white transition-colors"
                                                >
                                                    Ver na Loja <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Category Badge */}
                                    <span className="absolute top-4 left-4 bg-[#0A1128]/90 text-[#D4AF37] px-3 py-1 text-[10px] uppercase tracking-wider font-semibold">
                                        {book.category}
                                    </span>
                                </div>

                                {/* Book Info */}
                                <div className="text-center">
                                    <h3 className="font-heading text-lg text-[#0A1128] mb-1 group-hover:text-[#D4AF37] transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-[#D4AF37] italic mb-2 font-heading">
                                        {book.subtitle}
                                    </p>
                                    <p className="text-xs text-[#4A4A4A]">
                                        por {book.author}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-28 bg-[#0A1128] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img 
                        src="https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-px w-12 bg-[#D4AF37]"></div>
                        <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                        <div className="h-px w-12 bg-[#D4AF37]"></div>
                    </div>
                    <h2 className="font-heading text-4xl md:text-5xl text-[#FDFBF7] mb-6">
                        Adquira Seus Livros
                    </h2>
                    <p className="text-lg text-[#FDFBF7]/70 mb-8 max-w-2xl mx-auto">
                        Visite nossa loja oficial para adquirir qualquer uma das obras. 
                        Cada leitura é uma jornada de transformação.
                    </p>
                    <a 
                        href="https://loja.infinitepay.io/ver_ler"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 btn-gold text-lg px-10 py-4"
                        data-testid="cta-store-btn"
                    >
                        <span>Ir para a Loja</span>
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </div>
            </section>

            {/* Book Detail Modal */}
            {selectedBook && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1128]/90 backdrop-blur-sm"
                    onClick={() => setSelectedBook(null)}
                >
                    <div 
                        className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="bg-[#EAE6D9] p-8 flex items-center justify-center">
                                <img 
                                    src={selectedBook.cover}
                                    alt={selectedBook.title}
                                    className="max-h-[60vh] w-auto shadow-2xl"
                                />
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 text-xs uppercase tracking-wider font-semibold mb-4 w-fit">
                                    {selectedBook.category}
                                </span>
                                <h3 className="font-heading text-3xl text-[#0A1128] mb-2">
                                    {selectedBook.title}
                                </h3>
                                <p className="text-lg text-[#D4AF37] font-heading italic mb-4">
                                    {selectedBook.subtitle}
                                </p>
                                <p className="text-sm text-[#4A4A4A] mb-6">
                                    por <span className="text-[#0A1128] font-medium">{selectedBook.author}</span>
                                </p>
                                <p className="text-[#4A4A4A] leading-relaxed mb-8">
                                    {selectedBook.description}
                                </p>
                                <div className="flex gap-4">
                                    <a 
                                        href="https://loja.infinitepay.io/ver_ler"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-gold flex items-center gap-2"
                                    >
                                        Adquirir <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button 
                                        onClick={() => setSelectedBook(null)}
                                        className="btn-secondary"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerBooks;
