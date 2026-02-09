import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../../controllers/useAuth';
import { colors } from '../../theme/colors';
import { Button } from '../components/common/Button';
// import { Input } from '../components/common/Input';

export const LoginScreen = () => {
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa correo y contraseña');
            return;
        }
        await login(email, password);
    };

    const handleRegister = () => {
        // Navigate to register screen within auth group
        // router.push('/(auth)/register');
        Alert.alert('Info', 'Registro pendiente de implementación en UI');
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
                TerrePlus
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
                Bienvenido de nuevo
            </Text>

            {/* <Input
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            /> */}
            {/* 
            <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            /> */}

            <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading}>
                Iniciar Sesión
            </Button>

            <View style={styles.footer}>
                <Text variant="bodyMedium">¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={handleRegister}>
                    <Text style={styles.link}>Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        color: colors.primary,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 32,
        color: colors.textSecondary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    link: {
        color: colors.secondary,
        fontWeight: 'bold',
    },
});
