import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Copy, QrCode } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-[#F4F1EA]">
                <div className="text-center">
                    <p className="text-[#4A4A4A] mb-4">Pedido não encontrado.</p>
                    <Link to="/marketplace" className="btn-primary">
                        Voltar ao Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    const copyPixKey = () => {
        navigator.clipboard.writeText(order.pix_key);
        toast.success('Chave PIX copiada!');
    };

    return (
        <div className="pt-20 min-h-screen bg-[#F4F1EA]" data-testid="checkout-page">
            <section className="py-12 md:py-20">
                <div className="max-w-2xl mx-auto px-6 md:px-12">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" strokeWidth={1.5} />
                        <h1 className="font-heading text-4xl text-[#0A1128] mb-4">
                            Pedido Realizado!
                        </h1>
                        <p className="text-[#4A4A4A]">
                            Seu pedido #{order.id.slice(0, 8)} foi criado com sucesso.
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white p-8 border border-[#D4AF37]/20 mb-8">
                        <h2 className="font-heading text-2xl text-[#0A1128] mb-6">Detalhes do Pedido</h2>
                        
                        <div className="space-y-4 mb-6">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between py-2 border-b border-[#EAE6D9]">
                                    <div>
                                        <p className="text-[#0A1128] font-medium">{item.title}</p>
                                        <p className="text-sm text-[#4A4A4A]">Qtd: {item.quantity}</p>
                                    </div>
                                    <p className="text-[#0A1128]">
                                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between pt-4 border-t border-[#D4AF37]/20">
                            <span className="font-heading text-xl text-[#0A1128]">Total</span>
                            <span className="font-heading text-2xl text-[#D4AF37]">
                                R$ {order.total.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                    </div>

                    {/* PIX Payment */}
                    <div className="bg-[#0A1128] p-8 text-center" data-testid="pix-section">
                        <h2 className="font-heading text-2xl text-[#FDFBF7] mb-6">Pagamento via PIX</h2>
                        
                        <div className="bg-white p-6 inline-block mb-6">
                            <QrCode className="w-48 h-48 mx-auto text-[#0A1128]" strokeWidth={0.5} />
                        </div>

                        <p className="text-[#FDFBF7]/70 mb-4">Ou copie a chave PIX abaixo:</p>

                        <div className="flex items-center justify-center gap-2 bg-[#FDFBF7]/10 p-4 rounded">
                            <code className="text-[#D4AF37] text-lg break-all">
                                {order.pix_key || 'PIX_KEY_NAO_CONFIGURADA'}
                            </code>
                            <button 
                                onClick={copyPixKey}
                                className="p-2 hover:bg-[#FDFBF7]/10 rounded transition-colors"
                                data-testid="copy-pix-btn"
                            >
                                <Copy className="w-5 h-5 text-[#FDFBF7]" />
                            </button>
                        </div>

                        {order.pix_key === 'PIX_KEY_NAO_CONFIGURADA' && (
                            <p className="text-yellow-400 text-sm mt-4">
                                Nota: A chave PIX ainda não foi configurada pelo vendedor.
                            </p>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 p-6 bg-[#EAE6D9] border-l-4 border-[#D4AF37]">
                        <h3 className="font-heading text-lg text-[#0A1128] mb-2">Instruções</h3>
                        <ol className="list-decimal list-inside text-[#4A4A4A] space-y-2">
                            <li>Abra o app do seu banco</li>
                            <li>Escaneie o QR Code ou copie a chave PIX</li>
                            <li>Confirme o valor e finalize o pagamento</li>
                            <li>Você receberá confirmação por email</li>
                        </ol>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-12">
                        <Link to="/" className="btn-primary" data-testid="back-home-btn">
                            Voltar para a Loja
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;
