import React from 'react';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

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
    const theme = useTheme();

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChangeComplete={onRegionChange}
            showsUserLocation={true}
            showsMyLocationButton={true}
        >
            {terrains.map((terrain) => {
                let coordinates = [];
                try {
                    if (typeof terrain.poligono === 'string') {

                    }

                    if (terrain.coordenadas && terrain.coordenadas.coordinates) {
                        const [lng, lat] = terrain.coordenadas.coordinates;
                        return (
                            <Marker
                                key={`marker-${terrain.id}`}
                                coordinate={{ latitude: lat, longitude: lng }}
                                title={terrain.ubicacion_nombre || `Terreno #${terrain.id}`}
                                description={`${terrain.area_hectareas} ha - ${terrain.tipo_suelo}`}
                            />
                        );
                    }
                } catch (e) {
                    console.warn("Error parsing terrain location", e);
                }
                return null;
            })}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
