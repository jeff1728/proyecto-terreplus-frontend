import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in leaflet with webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface LeafletMapProps {
    onSelectLocation: (location: { latitude: number; longitude: number }, polygon: { latitude: number; longitude: number }[]) => void;
    onDismiss: () => void;
}

const LocationMarker = ({ points, setPoints }: { points: L.LatLng[], setPoints: (p: L.LatLng[]) => void }) => {
    useMapEvents({
        click(e) {
            setPoints([...points, e.latlng]);
        },
    });

    return points.length > 0 ? (
        <>
            {points.map((pos, idx) => (
                <Marker key={idx} position={pos} />
            ))}
            {points.length > 0 && (
                <Polygon positions={points} pathOptions={{ color: 'blue' }} />
            )}
        </>
    ) : null;
};

// Component to recenter map when opened
const MapController = ({ center }: { center: L.LatLngExpression }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}

export default function LeafletMap({ onSelectLocation, onDismiss }: LeafletMapProps) {
    const theme = useTheme();
    const [points, setPoints] = useState<L.LatLng[]>([]);
    const [center, setCenter] = useState<L.LatLngExpression>([-0.1807, -78.4678]); // Quito

    useEffect(() => {
        // Reset or get location if needed
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error("Error getting location", error);
                }
            );
        }
    }, []);

    const handleClear = () => {
        setPoints([]);
    };

    const handleUndo = () => {
        setPoints(points.slice(0, -1));
    };

    const handleConfirm = () => {
        let finalCenter = { latitude: -0.1807, longitude: -78.4678 };
        if (Array.isArray(center) && center.length === 2) {
            finalCenter = { latitude: center[0], longitude: center[1] };
        } else if (typeof center === 'object' && 'lat' in center) {
            finalCenter = { latitude: center.lat, longitude: center.lng };
        }

        if (points.length > 0) {
            const latSum = points.reduce((sum, p) => sum + p.lat, 0);
            const lngSum = points.reduce((sum, p) => sum + p.lng, 0);
            finalCenter = {
                latitude: latSum / points.length,
                longitude: lngSum / points.length
            };
        }

        const polygonFormatted = points.map(p => ({ latitude: p.lat, longitude: p.lng }));
        onSelectLocation(finalCenter, polygonFormatted);
        onDismiss();
    };

    return (
        <View style={styles.container}>
            <Text variant="titleMedium" style={styles.title}>
                {points.length < 3 ? "Haz clic en el mapa para dibujar (min 3 ptos)" : "Polígono listo"}
            </Text>

            <View style={styles.mapContainer}>
                {/* @ts-ignore */}
                <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker points={points} setPoints={setPoints} />
                    <MapController center={center} />
                </MapContainer>
            </View>

            <View style={styles.controls}>
                <Text variant="bodySmall">Puntos: {points.length}</Text>
                <Button mode="text" onPress={handleUndo} disabled={points.length === 0}>Deshacer</Button>
                <Button mode="text" onPress={handleClear} disabled={points.length === 0}>Limpiar</Button>
            </View>

            <View style={styles.footer}>
                <Button mode="text" onPress={onDismiss}>Cancelar</Button>
                <Button mode="contained" onPress={handleConfirm} disabled={points.length > 0 && points.length < 3}>Confirmar</Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        textAlign: 'center',
        padding: 12,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
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
});
