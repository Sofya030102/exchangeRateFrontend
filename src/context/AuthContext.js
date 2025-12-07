// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Додаємо стейт для модального вікна
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('user_email');
        if (token && email) {
            setUser({ email });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginUser(email, password);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user_email', email);
        setUser({ email });
        setIsModalOpen(false); // Закриваємо вікно після успішного входу
    };

    const register = async (email, password) => {
        await registerUser(email, password);
        // Після реєстрації не закриваємо, а даємо користувачу увійти (або можна логінити автоматом)
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        setUser(null);
    };

    // Функції управління вікном
    const openAuthModal = () => setIsModalOpen(true);
    const closeAuthModal = () => setIsModalOpen(false);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            loading,
            isModalOpen,      // <--- Експортуємо стан
            openAuthModal,    // <--- Експортуємо функцію відкриття
            closeAuthModal    // <--- Експортуємо функцію закриття
        }}>
            {children}
        </AuthContext.Provider>
    );
};