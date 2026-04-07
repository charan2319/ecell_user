import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import { API_BASE } from './config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/products`);
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products from context:', err);
            setLoading(false);
        }
    };

    // Initial auth check
    useEffect(() => {
        fetchProducts();
    }, []);

    // Sync cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const updateUser = (updates) => {
        setUser(prev => {
            const newUser = { ...prev, ...updates };
            localStorage.setItem('user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const refreshUser = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${API_BASE}/auth/user/${user.id}`);
            const freshUser = res.data;
            
            // Critical check: don't restore if they logged out during the async call
            if (localStorage.getItem('user')) {
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
            }
        } catch (err) {
            console.error('Error refreshing user data:', err);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setCart([]);
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <AppContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, user, login, logout, updateUser, refreshUser, searchTerm, setSearchTerm, products, loading, fetchProducts }}>
            {children}
        </AppContext.Provider>
    );
};
