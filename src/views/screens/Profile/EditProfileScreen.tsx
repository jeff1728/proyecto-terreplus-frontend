import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { Button, Text, TextInput, useTheme, Avatar, IconButton, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '@/src/services/authService';
import { cloudinaryService } from '@/src/services/cloudinaryService';
import { styles } from './EditProfileScreen.styles';

export default function EditProfileScreen() {
    const router = useRouter();
    const theme = useTheme();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const user = await authService.getProfile();
            setName(user.nombre);
            setEmail(user.email);
            setRole(user.rol);
            setProfilePic(user.foto_perfil || '');
        } catch (error: any) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para cambiar la foto de perfil.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfilePic(result.assets[0].uri);
        }
    };

    const handleUpdate = async () => {
        if (!name) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        if (password) {
            if (password !== confirmPassword) {
                Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
                return;
            }
            if (!currentPassword) {
                Alert.alert('Error', 'Debes ingresar tu contraseña actual para cambiarla');
                return;
            }
        }

        try {
            setSaving(true);

            let imageUrl = profilePic;


            const isLocalUri = profilePic.startsWith('file:') || profilePic.startsWith('blob:') || profilePic.startsWith('content:');

            if (isLocalUri) {
                setUploading(true);
                try {
                    imageUrl = await cloudinaryService.uploadImage(profilePic);
                } catch (uploadError) {
                    Alert.alert('Error', 'Error al subir la imagen. Inténtalo de nuevo.');
                    setUploading(false);
                    setSaving(false);
                    return;
                }
                setUploading(false);
            }

            const updateData: any = {
                nombre: name,
                foto_perfil: imageUrl
            };

            if (password) {
                updateData.password = password;
                updateData.passwordold = currentPassword;
            }

            await authService.updateProfile(updateData);
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            router.back();
        } catch (error: any) {
            console.error('Update error:', error);
            const message = error.response?.data?.message || 'Error al actualizar el perfil';
            Alert.alert('Error', message);
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }]}>
                <Text>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={pickImage}>
                        {profilePic ? (
                            <Avatar.Image size={100} source={{ uri: profilePic }} />
                        ) : (
                            <Avatar.Text size={100} label={name.substring(0, 2).toUpperCase()} />
                        )}
                        <View style={styles.avatarEditIcon}>
                            <IconButton
                                icon="camera"
                                size={20}
                                onPress={pickImage}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                    Editar Perfil
                </Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    label="Correo Electrónico"
                    value={email}
                    mode="outlined"
                    style={styles.input}
                    disabled
                />
                <TextInput
                    label="Rol"
                    value={role}
                    mode="outlined"
                    style={styles.input}
                    disabled
                />

                <TextInput
                    label="Nombre Completo"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                />

                <Text style={styles.sectionTitle}>Cambiar Contraseña (Opcional)</Text>

                <TextInput
                    label="Contraseña Actual"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showCurrentPassword}
                    right={<TextInput.Icon icon={showCurrentPassword ? "eye-off" : "eye"} onPress={() => setShowCurrentPassword(!showCurrentPassword)} />}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Nueva Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput
                    label="Confirmar Nueva Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    right={<TextInput.Icon icon={showConfirmPassword ? "eye-off" : "eye"} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
                    mode="outlined"
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleUpdate}
                    loading={saving || uploading}
                    disabled={saving || uploading}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    {uploading ? 'Subiendo imagen...' : 'Guardar Cambios'}
                </Button>
            </View>
        </ScrollView>
    );
}
