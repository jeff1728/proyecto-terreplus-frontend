import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import { authService } from '@/src/services/authService';
import { styles } from './RegisterScreen.styles';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [role, setRole] = useState('agricultor');

    const router = useRouter();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // 1. Validación de campos vacíos
        if (!name || !email || !password || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }

        // 2. Validación de longitud (8-12 caracteres)
        if (password.length < 8 || password.length > 12) {
            alert('La contraseña debe tener entre 8 y 12 caracteres');
            return;
        }

        // 3. Validación de carácter especial
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharRegex.test(password)) {
            alert('La contraseña debe incluir al menos un carácter especial (ej: @, #, $, !)');
            return;
        }

        // 4. Confirmación de contraseña
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            await authService.register(name, email, password, role);
            alert('¡Registro exitoso! Por favor inicia sesión.');
            router.replace('/(auth)/login');
        } catch (error: any) {
            console.error('Register error:', error);
            const message = error.response?.data?.message || 'Error al registrarse';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView 
            contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
            showsVerticalScrollIndicator={false}
        >
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
                <Text style={styles.helperText}>* 8-12 caracteres y un símbolo especial</Text>

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
                        { value: 'agricultor', label: 'Agricultor' },
                        { value: 'inversionista', label: 'Inversionista' },
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