import React from 'react';
import './BookCarousel3D.css';

const BookCarousel3D = () => {
    const books = [
        {
            id: 1,
            title: "Muito Além do Que Seus Olhos Veem",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/1zr252gv_111.PNG"
        },
        {
            id: 2,
            title: "Além do Tempo",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/2nj7ucv4_444444.PNG"
        },
        {
            id: 3,
            title: "Você Sabia? Vencendo a Ansiedade",
            cover: "https://customer-assets.emergentagent.com/job_af7641f3-df7d-40e0-ac8d-d47156357b73/artifacts/gdbxtfhg_qq.PNG"
        },
        {
            id: 4,
            title: "Théo e a Pedra do Poder",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/bv9fx6zc_image.png"
        },
        {
            id: 5,
            title: "Lições que Herdei - Vozes de Minha Mãe",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/fq9wgk7k_image.png"
        },
        {
            id: 6,
            title: "Lições que Herdei - Fragmentos de Sabedoria",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/ckszp84j_image.png"
        },
        {
            id: 7,
            title: "Pré-Ocupação",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/8duiy6dc_image.png"
        },
        {
            id: 8,
            title: "Vai Passar",
            cover: "https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/528ld8gr_image.png"
        }
    ];

    const n = books.length;

    return (
        <div className="carousel-scene" data-testid="book-carousel-3d">
            <div className="carousel-a3d" style={{ '--n': n }}>
                {books.map((book, index) => (
                    <img 
                        key={book.id}
                        className="carousel-card"
                        src={book.cover}
                        alt={book.title}
                        style={{ '--i': index }}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookCarousel3D;
