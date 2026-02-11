import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        marginTop: 16,
        textAlign: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarEditIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    form: {
        gap: 16,
    },
    input: {
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
    },
    buttonContent: {
        paddingVertical: 6,
    },
});
