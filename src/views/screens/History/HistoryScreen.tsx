import React, { useState, useCallback } from 'react';
import { View, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { getMyTerrains } from '@/src/services/terrain.service';
import { styles } from './HistoryScreen.styles';

export default function HistoryScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [terrains, setTerrains] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadTerrains = async () => {
        try {
            const data = await getMyTerrains();
            setTerrains(data);
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTerrains();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadTerrains();
    };

    const handlePressCard = (terrain: any) => {
        // Navigate to the main estimation screen with the terrain ID to auto-load it
        // We pass the ID as a param. The index screen needs to handle this.
        router.push({
            pathname: "/(tabs)",
            params: { terrainId: terrain.id }
        });
    };

    const renderItem = ({ item }: { item: any }) => {
        const latestConsulta = item.mis_consultas && item.mis_consultas.length > 0 ? item.mis_consultas[0] : (item.Consultas && item.Consultas.length > 0 ? item.Consultas[0] : null);
        const hasEstimate = !!latestConsulta;
        const formattedDate = latestConsulta ? new Date(latestConsulta.fecha).toLocaleDateString() : 'Sin estimación';

        return (
            <Card style={styles.card} onPress={() => handlePressCard(item)}>
                <Card.Title
                    title={item.ubicacion_nombre || `Terreno #${item.id}`}
                    subtitle={`Registrado: ${item.id}`} // We could format a created_at if available, using ID for now or lookup fetch date
                    left={(props) => <Avatar.Icon {...props} icon="sprout" style={{ backgroundColor: theme.colors.secondaryContainer }} />}
                    right={(props) => (
                        hasEstimate
                            ? <Text style={{ marginRight: 16, fontWeight: 'bold', color: theme.colors.primary }}>${Number(latestConsulta.valor_estimado_hectarea).toLocaleString()}/ha</Text>
                            : <Text style={{ marginRight: 16, fontStyle: 'italic', color: 'gray' }}>Sin estimar</Text>
                    )}
                />
                <Card.Content>
                    <View style={styles.row}>
                        <Chip icon="ruler" compact style={styles.chip}>{item.area_hectareas} ha</Chip>
                        <Chip icon="water" compact style={styles.chip} selected={item.acceso_riego}>
                            {item.acceso_riego ? 'Riego' : 'Secano'}
                        </Chip>
                        <Chip icon="road" compact style={styles.chip}>{item.proximidad_vias_km} km</Chip>
                    </View>
                    <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                        Suelo: <Text style={{ fontWeight: 'bold' }}>{item.tipo_suelo}</Text>
                    </Text>
                    {hasEstimate && (
                        <Text variant="bodySmall" style={{ marginTop: 4, color: 'gray' }}>
                            {/* Fecha de estimación: {formattedDate} */}
                            Última estimación: {formattedDate}
                        </Text>
                    )}
                </Card.Content>
            </Card>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Historial</Text>
                <Text variant="bodyLarge">Mis terrenos y estimaciones</Text>
            </View>

            {loading && !refreshing ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={terrains}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <Text>No tienes terrenos registrados aún.</Text>
                            <Button mode="contained" onPress={() => router.push("/(tabs)")} style={{ marginTop: 20 }}>
                                Registrar Nuevo
                            </Button>
                        </View>
                    }
                />
            )}
        </View>
    );
}
