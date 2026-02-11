import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
        // Mejora visual para Web
        alignSelf: 'center',
        width: '100%',
        maxWidth: 500, 
    },
    title: {
        textAlign: 'center',
        marginBottom: 32,
    },
    form: {
        gap: 16,
        width: '100%',
    },
    input: {
        backgroundColor: 'transparent',
    },
    helperText: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: -10,
        marginLeft: 4,
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
        marginBottom: 24,
    },
});