import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for guest IDs

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const guestUser = localStorage.getItem('guestId');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (guestUser) {
            setUser({ _id: guestUser, name: "Guest User", isGuest: true });
        }
    }, []);

    const login = async (credentials, isGuest = false) => {
        try {
            if (isGuest) {
                // Guest Login: Generate Unique ID
                const guestId = uuidv4();
                localStorage.setItem('guestId', guestId);
                const guestData = { _id: guestId, name: "Guest User", isGuest: true };
                setUser(guestData);
                navigate('/dashboard');
            } else {
                // Normal User Login
                const { data } = await axios.post('http://localhost:5000/api/auth/login', credentials);
                localStorage.setItem('user', JSON.stringify(data));
                setUser(data);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (credentials) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', credentials);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            navigate('/dashboard');
        } catch (error) {
            console.error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('guestId'); // Ensure guest logout
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
