import { User } from '../models/User';
import api from './api';
import { storage } from './storage';

interface AuthResponse {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    accessToken: string;
}

interface RegisterResponse {
    message: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<User> => {
        const response = await api.post<AuthResponse>('/auth/signin', { email, password });

        const { accessToken, ...userData } = response.data;

        if (accessToken) {
            await storage.saveToken(accessToken);
        }

        // Return user data adapted to frontend model if necessary
        return userData as unknown as User;
    },

    register: async (nombre: string, email: string, password: string, rol: string): Promise<void> => {
        // Backend expects: { nombre, email, password, rol }
        await api.post<RegisterResponse>('/auth/signup', {
            nombre,
            email,
            password,
            rol
        });
    },

    logout: async () => {
        await storage.removeToken();
    }
};
