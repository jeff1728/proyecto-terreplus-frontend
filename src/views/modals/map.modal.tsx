import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Region, Polygon, Marker } from 'react-native-maps';
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';

interface MapModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSelectLocation: (location: { latitude: number; longitude: number }, polygon: { latitude: number; longitude: number }[]) => void;
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
    const [polygonPoints, setPolygonPoints] = useState<{ latitude: number; longitude: number }[]>([]);

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

    const handleMapPress = (e: any) => {
        const { coordinate } = e.nativeEvent;
        setPolygonPoints([...polygonPoints, coordinate]);
    };

    const handleUndo = () => {
        setPolygonPoints(polygonPoints.slice(0, -1));
    };

    const handleClear = () => {
        setPolygonPoints([]);
    };

    const handleConfirm = () => {
        // If we have a polygon, calculate centroid or use the current center?
        // Better to use the centroid of the polygon if it exists, otherwise the map center.

        let center = { latitude: region.latitude, longitude: region.longitude };

        if (polygonPoints.length > 0) {
            const latSum = polygonPoints.reduce((sum, p) => sum + p.latitude, 0);
            const lngSum = polygonPoints.reduce((sum, p) => sum + p.longitude, 0);
            center = {
                latitude: latSum / polygonPoints.length,
                longitude: lngSum / polygonPoints.length
            };
        }

        onSelectLocation(center, polygonPoints);
        onDismiss();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContent}>
                <View style={styles.container}>
                    <Text variant="titleMedium" style={styles.title}>
                        {polygonPoints.length < 3 ? "Toca el mapa para dibujar el polígono (min 3 ptos)" : "Polígono listo"}
                    </Text>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={region}
                            onRegionChangeComplete={handleRegionChange}
                            showsUserLocation={permissionGranted}
                            showsMyLocationButton={permissionGranted}
                            onPress={handleMapPress}
                        >
                            {/* Marker for points */}
                            {polygonPoints.map((point, index) => (
                                <Marker
                                    key={index}
                                    coordinate={point}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                >
                                    <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
                                </Marker>
                            ))}

                            {/* Polygon */}
                            {polygonPoints.length > 0 && (
                                <Polygon
                                    coordinates={polygonPoints}
                                    strokeColor={theme.colors.primary}
                                    fillColor={theme.colors.primary + '40'} // Transparent fill
                                    strokeWidth={2}
                                />
                            )}
                        </MapView>

                        {/* Overlay Marker center if no points to indicate "just center selection" if desired, 
                            but here we enforce polygon or center logic. 
                            Let's show it only if empty. */}
                        {polygonPoints.length === 0 && (
                            <View style={styles.markerFixed}>
                                <View style={[styles.marker, { backgroundColor: theme.colors.secondary }]} />
                            </View>
                        )}
                    </View>

                    <View style={styles.controls}>
                        <Text variant="bodySmall">Puntos: {polygonPoints.length}</Text>
                        <Button mode="text" onPress={handleUndo} disabled={polygonPoints.length === 0}>Deshacer</Button>
                        <Button mode="text" onPress={handleClear} disabled={polygonPoints.length === 0}>Limpiar</Button>
                    </View>

                    <View style={styles.footer}>
                        <Button mode="text" onPress={onDismiss} style={styles.button}>
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleConfirm}
                            style={styles.button}
                            // valid if just a point (center) OR a valid polygon (3+ points)
                            disabled={polygonPoints.length > 0 && polygonPoints.length < 3}
                        >
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
        height: '85%',
        overflow: 'hidden',
    },
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
        padding: 12,
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
    dot: {
        height: 12,
        width: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'white',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f5f5f5'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0'
    },
    button: {
        minWidth: 100,
    },
});
