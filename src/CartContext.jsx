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

    // Location state
    const [userLocation, setUserLocation] = useState(() => {
        const saved = localStorage.getItem('userLocation');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return null; }
        }
        return null;
    });
    const [detecting, setDetecting] = useState(false);

    const reverseGeocode = async (lat, lon) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
                headers: { 'User-Agent': "FounderMartEcommerceApp/1.0" },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await response.json();
            const address = data.address;
            const area = address.suburb || address.neighbourhood || address.residential || address.city_district || "";
            const city = address.city || address.town || address.village || "";
            const road = address.road || "";
            const postcode = address.postcode || "";
            const cleanName = area && city ? `${area}, ${city}` : (area || city || road || "Current Location");
            const shortArea = area || city || "Near You";
            return { name: cleanName, shortName: shortArea, pincode: postcode, full: data.display_name, lat, lon };
        } catch (err) {
            clearTimeout(timeoutId);
            return { name: "Current Location", shortName: "Current Location", pincode: "", lat, lon };
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setDetecting(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = await reverseGeocode(latitude, longitude);
            setUserLocation(locationData);
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            setDetecting(false);
        }, (error) => {
            console.error('Geolocation error:', error);
            let errorMsg = "Unable to retrieve your location.";
            if (error.code === 1) errorMsg = "Permission denied. Please allow location access in your browser settings.";
            else if (error.code === 2) errorMsg = "Location unavailable. Please try again or check your GPS.";
            else if (error.code === 3) errorMsg = "Location request timed out. Please try again.";
            alert(errorMsg);
            setDetecting(false);
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    };

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
        localStorage.removeItem('userToken');
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
        <AppContext.Provider value={{ 
            cart, addToCart, removeFromCart, clearCart, 
            user, login, logout, updateUser, refreshUser, 
            searchTerm, setSearchTerm, 
            products, loading, setLoading, fetchProducts,
            userLocation, detecting, handleDetectLocation
        }}>
            {children}
        </AppContext.Provider>
    );
};
