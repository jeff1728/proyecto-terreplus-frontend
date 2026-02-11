import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        // --- AJUSTES PARA WEB ---
        alignSelf: 'center', 
        width: '100%',       
        maxWidth: 450,       
        // -------------------------
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: 'bold',
    },
    // ... el resto de tus estilos se mantienen exactamente igual
    subtitle: {
        textAlign: 'center',
        marginBottom: 48,
        opacity: 0.7,
    },
    form: {
        gap: 16,
    },
    button: {
        marginTop: 8,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    input: {
        backgroundColor: 'transparent',
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});
