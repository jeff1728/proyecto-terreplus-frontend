import { useRouter } from 'expo-router';
import { useState } from 'react';
import { User } from '../models/User';
import { authService } from '../services/authService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const loggedUser = await authService.login(email, password);
            setUser(loggedUser);
            // TODO: Save token to AsyncStorage

            // Navigate to the main tab layout
            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
            alert('Error al iniciar sesión. Por favor verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, rol: 'inversionista' | 'agricultor') => {
        setLoading(true);
        try {
            const newUser = await authService.register({ nombre: name, email, password, rol });
            setUser(newUser);
            router.replace('/(tabs)');
        } catch (error) {
            console.error(error);
            alert('Error al registrar usuario.');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        // TODO: Clear token from AsyncStorage
        router.replace('/(auth)/login');
    };

    return { user, login, register, logout, loading };
};
