import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use your computer's IP address so physical devices and emulators can reach the backend
const HOST_IP = '192.168.1.6';
export const SERVER_URL = `http://${HOST_IP}:3000`;
const BASE_URL = `${SERVER_URL}/api`;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if we implement JWT later
api.interceptors.request.use(
    async (config) => {
        // const token = await AsyncStorage.getItem('userToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    signup: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/signup', { name, email, password });
        return response.data;
    },
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
};

export const soundService = {
    logSound: async (userId: number, soundLabel: string, confidence: number) => {
        const response = await api.post('/sounds/log', { userId, soundLabel, confidence });
        return response.data;
    },
    getHistory: async (userId: number) => {
        const response = await api.get(`/sounds/history/${userId}`);
        return response.data;
    },
};

// User related API calls
export const userService = {
    updatePreferences: async (userId: number, preferences: any) => {
        const response = await api.put(`/users/${userId}/preferences`, { preferences });
        return response.data;
    },
    updateProfile: async (userId: number, name: string, email: string, phone?: string) => {
        const response = await api.put(`/users/${userId}`, { name, email, phone });
        return response.data;
    },
    uploadProfileImage: async (userId: number, imageUri: string) => {
        const formData = new FormData();

        // Create file object from URI
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('profileImage', {
            uri: imageUri,
            name: filename,
            type,
        } as any);

        const response = await api.post(`/users/${userId}/upload-profile-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};

export default api;
