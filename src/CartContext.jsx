import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

import { API_BASE } from './config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
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
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchProducts();
    }, []);

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
        <AppContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, user, login, logout, updateUser, searchTerm, setSearchTerm, products, loading, fetchProducts }}>
            {children}
        </AppContext.Provider>
    );
};
