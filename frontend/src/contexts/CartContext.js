import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const API = process.env.REACT_APP_BACKEND_URL + '/api';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchCart = async () => {
        if (!user) {
            setCartItems([]);
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${API}/cart`, { withCredentials: true });
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (bookId, quantity = 1) => {
        try {
            await axios.post(`${API}/cart`, { book_id: bookId, quantity }, { withCredentials: true });
            await fetchCart();
        } catch (error) {
            throw error;
        }
    };

    const removeFromCart = async (bookId) => {
        try {
            await axios.delete(`${API}/cart/${bookId}`, { withCredentials: true });
            await fetchCart();
        } catch (error) {
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            await axios.delete(`${API}/cart`, { withCredentials: true });
            setCartItems([]);
        } catch (error) {
            throw error;
        }
    };

    const cartTotal = cartItems.reduce((total, item) => {
        return total + (item.book?.price || 0) * item.quantity;
    }, 0);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            loading, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            fetchCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
