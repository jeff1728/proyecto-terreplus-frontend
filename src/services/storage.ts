import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

// Helper to check if we can use SecureStore (not available on web in the same way)
const isSecureStoreAvailable = Platform.OS !== 'web';

export const storage = {
    saveToken: async (token: string) => {
        if (isSecureStoreAvailable) {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        } else {
            // Fallback for web (localStorage) if you ever target web
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    getToken: async (): Promise<string | null> => {
        if (isSecureStoreAvailable) {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } else {
            return localStorage.getItem(TOKEN_KEY);
        }
    },

    removeToken: async () => {
        if (isSecureStoreAvailable) {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    },
};
