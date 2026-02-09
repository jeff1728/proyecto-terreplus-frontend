import React, { createContext, useContext, useState } from 'react';
// import { Auth0Provider as RNAuth0Provider, useAuth0 } from 'react-native-auth0'; // DISABLE FOR EXPO GO

// Define the shape of the context
interface AuthContextType {
    token: string | null;
    user: any | null;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    isLoading: true,
    signIn: async () => { },
    signOut: async () => { },
    error: null,
});

// Use your actual domain and client id here
const DOMAIN = "dev-rnm0w45msso20asj.us.auth0.com";
const CLIENT_ID = "0fbQygISBvrg97jrKV2HyaSp1rgoUk15";
const AUDIENCE = `https://${DOMAIN}/api/v2/`;

export const useAuth = () => useContext(AuthContext);

// --- MOCK IMPLEMENTATION (NO-NATIVE CODE) ---
const MockAuthProviderInner = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async () => {
        setIsLoading(true);
        // Simulates a login (no real Auth0)
        setTimeout(() => {
            setToken("mock-token-123");
            setUser({ name: "Usuario Expo Go", email: "test@expogo.com" });
            setIsLoading(false);
        }, 1000);
    };

    const signOut = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setToken(null);
            setUser(null);
            setIsLoading(false);
        }, 500);
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, error: null }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- REAL IMPLEMENTATION (PRESERVED BUT COMMENTED) ---
/*
const AuthProviderInner = ({ children }: { children: React.ReactNode }) => {
    const { authorize, clearSession, user, error, getCredentials, isLoading } = useAuth0();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                if (user) {
                    const instructions = await getCredentials();
                    if (instructions) {
                        setToken(instructions.accessToken);
                    }
                } else {
                    setToken(null);
                }
            } catch (e) {
                console.log("Error getting credentials", e);
            }
        }
        checkToken();
    }, [user]);

    const signIn = async () => {
        try {
            await authorize({
                 scope: 'openid profile email offline_access',
                 audience: AUDIENCE
            });
        } catch (e) {
            console.log('Login cancelled or failed', e);
        }
    };

    const signOut = async () => {
        try {
            await clearSession();
            setToken(null);
        } catch (e) {
            console.log('Logout cancelled or failed', e);
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, error }}>
            {children}
        </AuthContext.Provider>
    );
};
*/

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. MOCK MODE (For Expo Go):
    return <MockAuthProviderInner>{children}</MockAuthProviderInner>;

    // 2. NATIVE MODE (For Android/iOS Builds):
    /*
    return (
        <RNAuth0Provider domain={DOMAIN} clientId={CLIENT_ID}>
            <AuthProviderInner>{children}</AuthProviderInner>
        </RNAuth0Provider>
    );
    */
};
