import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '@/src/theme';

const { width } = Dimensions.get('window');

// Estilos para la pantalla de Dashboard (Tema Claro)
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Fondo gris claro
    },
    scrollViewContent: {
        padding: 16,
        paddingBottom: 80, // Espacio para la barra de pestañas
    },
    header: {
        marginBottom: 24,
        marginTop: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333', // Texto oscuro
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666', // Gris medio
    },
    kpiContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    kpiCard: {
        width: (width - 40) / 2, // 2 columnas con espacio
        backgroundColor: '#FFFFFF', // Fondo blanco para tarjetas
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        // Sombras suaves para dar profundidad en tema claro
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    kpiTitle: {
        fontSize: 12,
        color: '#888888',
        marginBottom: 8,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    kpiValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
    chartSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    listSection: {
        marginBottom: 24,
    },
    listItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    listContent: {
        flex: 1,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    listSubtitle: {
        fontSize: 14,
        color: '#888888',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: theme.colors.primary + '15', // Opacidad muy baja
    },
    badgeText: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        textAlign: 'center',
    },
});
