import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';

interface MapModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSelectLocation: (location: { latitude: number; longitude: number }) => void;
}

export const MapModal = ({ visible, onDismiss, onSelectLocation }: MapModalProps) => {
    const theme = useTheme();
    const [region, setRegion] = useState<Region>({
        latitude: -0.1807, // Default to Quito, Ecuador
        longitude: -78.4678,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        (async () => {
            if (visible) {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }
                setPermissionGranted(true);
                let location = await Location.getCurrentPositionAsync({});
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        })();
    }, [visible]);

    const handleRegionChange = (newRegion: Region) => {
        setRegion(newRegion);
    };

    const handleConfirm = () => {
        onSelectLocation({
            latitude: region.latitude,
            longitude: region.longitude,
        });
        onDismiss();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContent}>
                <View style={styles.container}>
                    <Text variant="titleMedium" style={styles.title}>Selecciona la Ubicación</Text>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={region}
                            onRegionChangeComplete={handleRegionChange}
                            showsUserLocation={permissionGranted}
                            showsMyLocationButton={permissionGranted}
                        >
                            {/* Marker fixed at center */}
                        </MapView>
                        {/* Overlay Marker to indicate center */}
                        <View style={styles.markerFixed}>
                            <View style={[styles.marker, { backgroundColor: theme.colors.primary }]} />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Button mode="text" onPress={onDismiss} style={styles.button}>
                            Cancelar
                        </Button>
                        <Button mode="contained" onPress={handleConfirm} style={styles.button}>
                            Confirmar
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 12,
        height: '80%',
        overflow: 'hidden',
    },
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        padding: 16,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerFixed: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -10,
        marginTop: -20,
    },
    marker: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        gap: 8,
    },
    button: {
        minWidth: 100,
    },
});
