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
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/user/profile');
        return response.data;
    },

    updateProfile: async (data: { nombre?: string; foto_perfil?: string; password?: string; passwordold?: string }): Promise<{ message: string; user: User }> => {
        const response = await api.put<{ message: string; user: User }>('/user/profile', data);
        return response.data;
    }
};
