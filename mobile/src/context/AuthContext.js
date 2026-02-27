import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null); // YENİ: Kullanıcının rolü ve bilgileri burada duracak
    const [isLoading, setIsLoading] = useState(true);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                setUserToken(token);
                // Token varsa arka planda kullanıcının kim olduğunu da sor
                const response = await api.get('/users/me');
                setUserInfo(response.data);
            }
        } catch (e) {
            console.log('Token okuma veya profil getirme hatası:', e);
            setUserToken(null);
            setUserInfo(null);
            await AsyncStorage.removeItem('userToken');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkToken();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data.token;
            
            await AsyncStorage.setItem('userToken', token); // Önce token'ı kaydet
            setUserToken(token);
            
            // Giriş yapar yapmaz kim olduğunu çek ve kaydet
            const userRes = await api.get('/users/me');
            setUserInfo(userRes.data);
            
            return true;
        } catch (error) {
            console.error('Giriş hatası:', error);
            return false;
        }
    };

    const logout = async () => {
        setUserToken(null);
        setUserInfo(null);
        await AsyncStorage.removeItem('userToken');
    };

    return (
        <AuthContext.Provider value={{ login, logout, userToken, userInfo, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};