import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

export default function MapComponent(props: MapComponentProps) {
    return (
        <View style={styles.container}>
            <Text>Map not supported on this platform</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
