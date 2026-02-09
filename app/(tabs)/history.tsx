import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function HistoryScreen() {
    const theme = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineMedium">Historial</Text>
            <Text>Pantalla de historial de estimaciones</Text>
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
