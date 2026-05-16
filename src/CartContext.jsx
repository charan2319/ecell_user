import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { API_BASE } from './config';

export const AppContext = createContext(); // eslint-disable-line react-refresh/only-export-components

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
            try { return JSON.parse(saved); } catch { return null; }
        }
        return null;
    });
    const [detecting, setDetecting] = useState(false);

    // ── Saved Addresses — sourced from the BACKEND (cross-device) ──
    // localStorage is used only as a fast cache so the UI loads instantly.
    const addrCacheKey = (uid) => uid ? `addrCache_${uid}` : null;

    const [savedAddresses, setSavedAddresses] = useState(() => {
        const storedUser = localStorage.getItem('user');
        const uid = storedUser ? JSON.parse(storedUser)?.id : null;
        const key = addrCacheKey(uid);
        if (!key) return [];
        try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    });

    const [selectedAddressId, setSelectedAddressId] = useState(() => {
        const storedUser = localStorage.getItem('user');
        const uid = storedUser ? JSON.parse(storedUser)?.id : null;
        return uid ? (localStorage.getItem(`selAddr_${uid}`) || null) : null;
    });

    // Helper: auth header from stored token
    const authHeader = () => {
        const token = localStorage.getItem('userToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ── Fetch addresses from backend (called on login & app mount if logged in) ──
    const fetchAddresses = useCallback(async (uid) => {
        if (!uid) return;
        try {
            const res = await axios.get(`${API_BASE}/addresses`, { headers: authHeader() });
            const addrs = res.data;
            setSavedAddresses(addrs);
            // Update cache
            const key = addrCacheKey(uid);
            if (key) localStorage.setItem(key, JSON.stringify(addrs));
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // On app start, if a user session exists, re-sync addresses from backend
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const uid = JSON.parse(storedUser)?.id;
            if (uid) fetchAddresses(uid);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep selectedAddressId in localStorage (it's just a preference, not sensitive data)
    useEffect(() => {
        const uid = user?.id;
        if (!uid) return;
        if (selectedAddressId) {
            localStorage.setItem(`selAddr_${uid}`, selectedAddressId);
        } else {
            localStorage.removeItem(`selAddr_${uid}`);
        }
    }, [selectedAddressId, user]);

    // ── Address CRUD — all backed by API ──

    const addAddress = async (addressData) => {
        try {
            const res = await axios.post(`${API_BASE}/addresses`, addressData, { headers: authHeader() });
            const newAddr = res.data;
            setSavedAddresses(prev => {
                const updated = [...prev, newAddr];
                if (user?.id) localStorage.setItem(addrCacheKey(user.id), JSON.stringify(updated));
                return updated;
            });
            setSelectedAddressId(String(newAddr.id));
            return newAddr;
        } catch (err) {
            console.error('Add address error:', err);
            alert(err.response?.data?.message || 'Failed to save address. Please try again.');
        }
    };

    const removeAddress = async (id) => {
        try {
            await axios.delete(`${API_BASE}/addresses/${id}`, { headers: authHeader() });
            setSavedAddresses(prev => {
                const remaining = prev.filter(a => String(a.id) !== String(id));
                if (user?.id) localStorage.setItem(addrCacheKey(user.id), JSON.stringify(remaining));
                if (String(selectedAddressId) === String(id)) {
                    const next = remaining.length > 0 ? String(remaining[0].id) : null;
                    setSelectedAddressId(next);
                }
                return remaining;
            });
        } catch (err) {
            console.error('Remove address error:', err);
            alert(err.response?.data?.message || 'Failed to delete address. Please try again.');
        }
    };

    const editAddress = async (id, updatedData) => {
        try {
            const res = await axios.put(`${API_BASE}/addresses/${id}`, updatedData, { headers: authHeader() });
            const updated = res.data;
            setSavedAddresses(prev => {
                const list = prev.map(a => String(a.id) === String(id) ? updated : a);
                if (user?.id) localStorage.setItem(addrCacheKey(user.id), JSON.stringify(list));
                return list;
            });
        } catch (err) {
            console.error('Edit address error:', err);
            alert(err.response?.data?.message || 'Failed to update address. Please try again.');
        }
    };

    const selectAddress = (id) => {
        setSelectedAddressId(id ? String(id) : null);
    };

    const getSelectedAddress = () => {
        if (!selectedAddressId) return null;
        const found = savedAddresses.find(a => String(a.id) === String(selectedAddressId));
        if (found) return found;
        // Stale reference — address was deleted
        setSelectedAddressId(null);
        return null;
    };

    // ── Geocoding ──

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
        } catch {
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

    // ── Products ──

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/products`);
            const electronicsSubcats = [
                'laptops', 'headphones', 'earbuds', 'laptop accessories',
                'mobile accessories', 'camera accessories', 'lighting',
                'smartwatches', 'speakers', 'power banks', 'tablets',
                'monitors', 'keyboards', 'mice', 'chargers', 'cables'
            ];
            const mappedProducts = res.data.map(p => {
                if (p.category && electronicsSubcats.includes(p.category.toLowerCase().trim())) {
                    return { ...p, category: 'Electronics', original_category: p.category };
                }
                return p;
            });
            setProducts(mappedProducts);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products from context:', err);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(); // eslint-disable-line react-hooks/set-state-in-effect
    }, [fetchProducts]);

    // Sync cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // ── Auth ──

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) localStorage.setItem('userToken', token);

        // Restore cached addresses immediately (fast), then sync from backend
        const uid = userData?.id;
        const key = addrCacheKey(uid);
        const cached = key ? localStorage.getItem(key) : null;
        setSavedAddresses(cached ? JSON.parse(cached) : []);
        setSelectedAddressId(uid ? (localStorage.getItem(`selAddr_${uid}`) || null) : null);

        // Async backend sync — will update state when it arrives
        if (uid) fetchAddresses(uid);
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
        setSavedAddresses([]);
        setSelectedAddressId(null);
    };

    // ── Cart ──

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateCartItemQty = (id, qty) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <AppContext.Provider value={{
            cart, addToCart, removeFromCart, clearCart, updateCartItemQty,
            user, login, logout, updateUser, refreshUser,
            searchTerm, setSearchTerm,
            products, loading, setLoading, fetchProducts,
            userLocation, detecting, handleDetectLocation,
            savedAddresses, selectedAddressId,
            addAddress, removeAddress, editAddress, selectAddress, getSelectedAddress
        }}>
            {children}
        </AppContext.Provider>
    );
};
