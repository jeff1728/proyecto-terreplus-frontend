import React, { Suspense } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Modal, Portal, useTheme } from 'react-native-paper';

// Dynamic import to avoid SSR 'window' not defined issues
const LeafletMap = React.lazy(() => import('./LeafletMap'));

interface MapModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSelectLocation: (location: { latitude: number; longitude: number }, polygon: { latitude: number; longitude: number }[]) => void;
}

export const MapModal = ({ visible, onDismiss, onSelectLocation }: MapModalProps) => {
    const theme = useTheme();

    // Ensure we only render the map if we are on client (though visible logic handles most cases)
    // But since this is Expo Router + Web, we might need to protect against initial render

    if (!visible) return null;

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContent}>
                <Suspense fallback={<View style={styles.loadingContainer}><ActivityIndicator size="large" color={theme.colors.primary} /></View>}>
                    <LeafletMap onSelectLocation={onSelectLocation} onDismiss={onDismiss} />
                </Suspense>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 12,
        height: '85%',
        overflow: 'hidden',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
