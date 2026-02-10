import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import { authService } from '../../src/services/authService';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('agricultor'); // Default valid role

    const router = useRouter();
    const theme = useTheme();

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            await authService.register(name, email, password, role);
            alert('¡Registro exitoso! Por favor inicia sesión.');
            router.replace('/(auth)/login'); // Or router.back()
        } catch (error: any) {
            console.error('Register error:', error);
            const message = error.response?.data?.message || 'Error al registrarse';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>
                Crear Cuenta
            </Text>

            <View style={styles.form}>
                <TextInput
                    label="Nombre Completo"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                />

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
                    secureTextEntry={!showPassword}
                    right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Confirmar Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                    mode="outlined"
                    style={styles.input}
                />

                <Text variant="titleMedium" style={{ marginTop: 8 }}>Selecciona tu Rol:</Text>
                <SegmentedButtons
                    value={role}
                    onValueChange={setRole}
                    buttons={[
                        {
                            value: 'agricultor',
                            label: 'Agricultor',
                        },
                        {
                            value: 'inversionista',
                            label: 'Inversionista',
                        },
                    ]}
                    style={{ marginBottom: 8 }}
                />

                <Button
                    mode="contained"
                    onPress={handleRegister}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    Registrarse
                </Button>

                <View style={styles.footerLinks}>
                    <Text variant="bodyMedium">¿Ya tienes cuenta?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold', marginLeft: 4 }}>
                            Inicia Sesión
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 32,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: 'transparent',
    },
    button: {
        marginTop: 16,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
});
