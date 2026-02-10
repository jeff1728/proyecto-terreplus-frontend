import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { styles } from './MapScreen.styles';

export default function MapScreen() {
    const theme = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineMedium">Mapa</Text>
            <Text>Pantalla de mapa de terrenos</Text>
        </View>
    );
}
