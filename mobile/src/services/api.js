import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// İŞTE BURAYA KENDİ IP ADRESİNİ YAZACAKSIN! (Sadece rakamları değiştir, tırnakları silme)
const IP_ADDRESS = '192.168.1.107'; 

const BASE_URL = `http://${IP_ADDRESS}:5000/api`;

const api = axios.create({
    baseURL: BASE_URL,
});

// Her istekten önce çalışacak ara katman (Interceptor)
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;