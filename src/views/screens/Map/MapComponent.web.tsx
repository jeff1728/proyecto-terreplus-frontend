import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface MapComponentProps {
    terrains: any[];
    region: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    onRegionChange: (region: any) => void;
}

export default function MapComponent({ terrains, region, onRegionChange }: MapComponentProps) {
    const [LeafletModules, setLeafletModules] = useState<any>(null);

    useEffect(() => {
        const loadModules = async () => {
            try {
                const L = require('leaflet');
                const ReactLeaflet = require('react-leaflet');
                require('leaflet/dist/leaflet.css');

                const iconUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png';
                const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
                const shadowUrl = 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png';

                const DefaultIcon = L.icon({
                    iconUrl,
                    iconRetinaUrl,
                    shadowUrl,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                L.Marker.prototype.options.icon = DefaultIcon;

                setLeafletModules({
                    MapContainer: ReactLeaflet.MapContainer,
                    TileLayer: ReactLeaflet.TileLayer,
                    Marker: ReactLeaflet.Marker,
                    Popup: ReactLeaflet.Popup,
                    useMap: ReactLeaflet.useMap,
                });
            } catch (error) {
                console.error("Error loading Leaflet modules:", error);
            }
        };

        if (typeof window !== 'undefined') {
            loadModules();
        }
    }, []);

    if (!LeafletModules) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando mapa...</Text>
            </View>
        );
    }

    const { MapContainer, TileLayer, Marker, Popup, useMap } = LeafletModules;

    const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(center, zoom);
        }, [center, zoom, map]);
        return null;
    };

    const zoom = 13;
    const center: [number, number] = [region.latitude, region.longitude];

    return (
        <View style={styles.container}>
            <style type="text/css">{`
                .leaflet-container {
                    height: 100%;
                    width: 100%;
                }
            `}</style>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {terrains.map((terrain) => {
                    if (terrain.coordenadas && terrain.coordenadas.coordinates) {
                        const [lng, lat] = terrain.coordenadas.coordinates;
                        return (
                            <Marker key={`marker-${terrain.id}`} position={[lat, lng]}>
                                <Popup>
                                    <strong>{terrain.ubicacion_nombre || `Terreno #${terrain.id}`}</strong><br />
                                    {terrain.area_hectareas} ha<br />
                                    {terrain.tipo_suelo}
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
