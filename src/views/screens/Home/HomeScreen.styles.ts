import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 60, // Top margin
    },
    title: {
        fontWeight: '600',
        marginBottom: 24,
    },
    form: {
        gap: 16,
        marginBottom: 32,
    },
    input: {
        backgroundColor: 'transparent',
        borderRadius: 8, // Rounded border attempt (Paper handles this via theme usually, but can override)
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        borderRadius: 8,
        marginTop: 8,
    },
    buttonContent: {
        height: 56, // Prominent height
    },
    buttonLabel: {
        fontSize: 16,
        // color: '#FFFFFF', // Handled dynamically
    },
    card: {
        borderRadius: 12,
        elevation: 2,
        backgroundColor: 'white',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: '#757575',
    },
    priceValue: {
        fontWeight: 'bold',
        marginVertical: 4,
    },
    cardDescription: {
        color: '#9E9E9E',
        marginTop: 4,
        marginRight: 8,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10
    }
});
