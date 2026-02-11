import axios from 'axios';

// Use environment variable or localhost for dev.
// Android emulator uses 10.0.2.2 for localhost
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://proyecto-terreplus-backend-production.up.railway.app/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token if exists (stub for now)
import { storage } from './storage';

// Interceptor to add token if exists
api.interceptors.request.use(
    async (config) => {
        const token = await storage.getToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
