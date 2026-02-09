import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function MapScreen() {
    const theme = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineMedium">Mapa</Text>
            <Text>Pantalla de mapa de terrenos</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
