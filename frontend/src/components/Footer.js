import { Link } from 'react-router-dom';
import { BookOpen, Mail, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0A1128] text-[#FDFBF7] py-16" data-testid="footer">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Logo & Description */}
                    <div className="md:col-span-2">
                        <img 
                            src="https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/vvyjps96_image.png" 
                            alt="Livraria Ver e Ler" 
                            className="h-16 w-auto mb-6"
                        />
                        <p className="text-[#FDFBF7]/70 leading-relaxed mb-6 max-w-md">
                            Uma livraria boutique dedicada a conectar leitores com histórias extraordinárias 
                            e apoiar autores independentes em sua jornada literária.
                        </p>
                        <p className="text-[#D4AF37] font-heading text-xl italic">
                            "Ver... Ler... Viver"
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-heading text-xl text-[#D4AF37] mb-6">Navegação</h4>
                        <nav className="flex flex-col gap-3">
                            <Link to="/historia" className="text-[#FDFBF7]/70 hover:text-[#D4AF37] transition-colors">
                                A Minha História
                            </Link>
                            <Link to="/livros-do-autor" className="text-[#FDFBF7]/70 hover:text-[#D4AF37] transition-colors">
                                Meus Livros
                            </Link>
                            <Link to="/marketplace" className="text-[#FDFBF7]/70 hover:text-[#D4AF37] transition-colors">
                                Mercado de Autores
                            </Link>
                            <Link to="/publicar" className="text-[#FDFBF7]/70 hover:text-[#D4AF37] transition-colors">
                                Publicar Meu Livro
                            </Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading text-xl text-[#D4AF37] mb-6">Contato</h4>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:contato@vereler.com" className="flex items-center gap-3 text-[#FDFBF7]/70 hover:text-[#D4AF37] transition-colors">
                                <Mail className="w-5 h-5" strokeWidth={1.5} />
                                contato@vereler.com
                            </a>
                            <div className="flex items-center gap-4 mt-4">
                                <a href="#" className="p-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">
                                    <Instagram className="w-5 h-5" strokeWidth={1.5} />
                                </a>
                                <a href="#" className="p-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all">
                                    <Facebook className="w-5 h-5" strokeWidth={1.5} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-8"></div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#FDFBF7]/50">
                    <p>© 2024 Livraria Ver e Ler. Todos os direitos reservados.</p>
                    <p>Desenvolvido com amor para os amantes de livros</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
