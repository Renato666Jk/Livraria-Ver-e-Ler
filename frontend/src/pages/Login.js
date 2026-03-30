import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'reader'
    });

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const formatApiError = (detail) => {
        if (!detail) return 'Algo deu errado. Tente novamente.';
        if (typeof detail === 'string') return detail;
        if (Array.isArray(detail)) {
            return detail.map(e => e?.msg || JSON.stringify(e)).join(' ');
        }
        if (detail?.msg) return detail.msg;
        return String(detail);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Login realizado com sucesso!');
            } else {
                await register(formData.email, formData.password, formData.name, formData.role);
                toast.success('Conta criada com sucesso!');
            }
            navigate('/');
        } catch (error) {
            const message = formatApiError(error.response?.data?.detail);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-[#F4F1EA]" data-testid="login-page">
            <div className="w-full max-w-md mx-6">
                <div className="bg-white p-8 md:p-12 border border-[#D4AF37]/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <img 
                            src="https://customer-assets.emergentagent.com/job_author-marketplace-8/artifacts/vvyjps96_image.png"
                            alt="Livraria Ver e Ler"
                            className="h-16 mx-auto mb-6"
                        />
                        <h1 className="font-heading text-3xl text-[#0A1128] mb-2">
                            {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
                        </h1>
                        <p className="text-[#4A4A4A]">
                            {isLogin ? 'Entre para acessar sua conta' : 'Junte-se à nossa comunidade literária'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm text-[#4A4A4A] mb-2">Nome</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" strokeWidth={1.5} />
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                        placeholder="Seu nome completo"
                                        required={!isLogin}
                                        data-testid="name-input"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm text-[#4A4A4A] mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" strokeWidth={1.5} />
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="seu@email.com"
                                    required
                                    data-testid="email-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-[#4A4A4A] mb-2">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4A4A]" strokeWidth={1.5} />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-12 py-3 border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none"
                                    placeholder="••••••••"
                                    required
                                    data-testid="password-input"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A4A4A]"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm text-[#4A4A4A] mb-2">Tipo de Conta</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio"
                                            name="role"
                                            value="reader"
                                            checked={formData.role === 'reader'}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="accent-[#D4AF37]"
                                        />
                                        <span className="text-[#0A1128]">Leitor</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio"
                                            name="role"
                                            value="author"
                                            checked={formData.role === 'author'}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="accent-[#D4AF37]"
                                        />
                                        <span className="text-[#0A1128]">Autor</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full btn-gold flex items-center justify-center gap-2"
                            data-testid="submit-btn"
                        >
                            {loading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    {isLogin ? <User className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                    {isLogin ? 'Entrar' : 'Criar Conta'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-8 text-center">
                        <p className="text-[#4A4A4A]">
                            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                            <button 
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 text-[#D4AF37] font-medium hover:underline"
                                data-testid="toggle-auth-btn"
                            >
                                {isLogin ? 'Criar conta' : 'Entrar'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
