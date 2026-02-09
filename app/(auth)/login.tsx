import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { authService } from '../../src/services/authService';

export default function LoginScreen() {
    const router = useRouter();
    const theme = useTheme();

    // Local state for inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Por favor valida tu correo y contraseña');
            return;
        }

        try {
            setLoading(true);
            await authService.login(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Error al iniciar sesión';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterNavigation = () => {
        router.push('/register');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>
                TerrePlus
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
                Tu aliado en terrenos
            </Text>

            <View style={styles.form}>
                <TextInput
                    label="Correo Electrónico"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    label="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    Iniciar Sesión
                </Button>

                <Button
                    mode="text"
                    onPress={handleRegisterNavigation}
                    style={styles.linkButton}
                >
                    ¿No tienes cuenta? Regístrate
                </Button>
            </View>

            <View style={styles.footer}>
                <Text variant="bodySmall" style={{ textAlign: 'center', color: '#888' }}>
                    Al continuar, aceptas nuestros términos y condiciones.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 48,
        opacity: 0.7,
    },
    form: {
        gap: 16,
    },
    button: {
        marginTop: 8,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    input: {
        backgroundColor: 'transparent',
    },
    linkButton: {
        marginTop: 8,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
});
