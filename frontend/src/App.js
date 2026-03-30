import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AuthorStory from "./pages/AuthorStory";
import OwnerBooks from "./pages/OwnerBooks";
import Marketplace from "./pages/Marketplace";
import BookDetail from "./pages/BookDetail";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PublishBook from "./pages/PublishBook";
import Dashboard from "./pages/Dashboard";
import AuthorProfile from "./pages/AuthorProfile";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <div className="App">
                        <Toaster 
                            position="top-right" 
                            toastOptions={{
                                style: {
                                    background: '#0A1128',
                                    color: '#FDFBF7',
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                }
                            }}
                        />
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/historia" element={<AuthorStory />} />
                                <Route path="/livros-do-autor" element={<OwnerBooks />} />
                                <Route path="/marketplace" element={<Marketplace />} />
                                <Route path="/livro/:id" element={<BookDetail />} />
                                <Route path="/autor/:id" element={<AuthorProfile />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/carrinho" element={<Cart />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/publicar" element={<PublishBook />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
