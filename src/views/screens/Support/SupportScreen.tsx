import { View, Alert } from 'react-native';
import { Text, useTheme, List, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { storage } from '@/src/services/storage';
import { styles } from './SupportScreen.styles';

export default function SupportScreen() {
    const theme = useTheme();

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        await storage.removeToken();
                        router.replace('/login');
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineMedium" style={styles.title}>Soporte</Text>

            <List.Section style={styles.listSection}>
                <List.Subheader>General</List.Subheader>
                <List.Item
                    title="Atención al Cliente"
                    left={props => <List.Icon {...props} icon="headset" />}
                    onPress={() => { }}
                />
                <List.Item
                    title="Acerca de"
                    left={props => <List.Icon {...props} icon="information" />}
                    onPress={() => { }}
                />
                <Divider />
                <List.Subheader>Configuración</List.Subheader>
                <List.Item
                    title="Editar Perfil"
                    description="Actualizar nombre, foto y contraseña"
                    left={props => <List.Icon {...props} icon="account-edit" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => router.push('/profile/edit')}
                />
                <List.Item
                    title="Apariencia"
                    description="Tema Claro / Oscuro"
                    left={props => <List.Icon {...props} icon="theme-light-dark" />}
                    right={props => <List.Icon {...props} icon="chevron-right" />}
                    onPress={() => { }}
                />
                <Divider />
                <List.Item
                    title="Cerrar Sesión"
                    titleStyle={{ color: theme.colors.error }}
                    left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
                    onPress={handleLogout}
                />
            </List.Section>
        </View>
    );
}
