import { MapModal } from '@/src/views/modals/map.modal';
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Avatar, Button, Card, Checkbox, Text, TextInput, useTheme, HelperText, Modal as PaperModal, Portal, List, Divider } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createTerrain, getMyTerrains } from '@/src/services/terrain.service';
import { estimateTerrainPrice } from '@/src/services/ml.service';
import { useAuth } from '@/src/providers/AuthProvider';
import { styles } from './HomeScreen.styles';

export default function EstimationScreen() {
    const theme = useTheme();
    const { signOut, user } = useAuth();

    // State for inputs
    const [locationName, setLocationName] = useState('');
    const [landType, setLandType] = useState('');
    const [landSize, setLandSize] = useState('');
    const [soilCondition, setSoilCondition] = useState('');
    const [waterAccess, setWaterAccess] = useState(false);
    const [infrastructure, setInfrastructure] = useState('');
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [polygon, setPolygon] = useState<{ latitude: number; longitude: number }[]>([]);

    // Validation errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [estimating, setEstimating] = useState(false);

    // Dropdown visibility simulation (Material Menu would be better, but simple toggle for now)
    const [showTypeMenu, setShowTypeMenu] = useState(false);
    const [showSoilMenu, setShowSoilMenu] = useState(false);

    const [showMapModal, setShowMapModal] = useState(false);

    // Terrain Selection State
    const [registeredId, setRegisteredId] = useState<number | null>(null);
    const [showTerrainModal, setShowTerrainModal] = useState(false);
    const [myTerrains, setMyTerrains] = useState<any[]>([]);

    const handleSelectLocation = (
        coords: { latitude: number; longitude: number },
        poly: { latitude: number; longitude: number }[]
    ) => {
        setCoordinates({ lat: coords.latitude, lng: coords.longitude });
        setPolygon(poly);
        // Auto-fill location name if empty or update to show coords
        if (!locationName) {
            setLocationName(`Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`);
        }
        // If location changes, reset registered ID because it's effectively a new terrain
        if (registeredId) setRegisteredId(null);
    };

    // Result state
    const [estimatedPrice, setEstimatedPrice] = useState<string | null>(null);

    const fetchMyTerrains = async () => {
        try {
            const terrains = await getMyTerrains();
            setMyTerrains(terrains);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudieron cargar tus terrenos.");
        }
    };

    const handleOpenTerrainModal = () => {
        fetchMyTerrains();
        setShowTerrainModal(true);
    };

    const handleSelectTerrain = (terrain: any) => {
        // Auto-fill form
        setLocationName(terrain.ubicacion_nombre || '');
        setLandSize(terrain.area_hectareas?.toString() || '');
        setSoilCondition(terrain.tipo_suelo || '');
        setWaterAccess(terrain.acceso_riego || false);
        setInfrastructure(terrain.proximidad_vias_km?.toString() || '');

        // Handle coordinates
        if (terrain.coordenadas && terrain.coordenadas.coordinates) {
            // PostGIS POINT(lng lat)
            const [lng, lat] = terrain.coordenadas.coordinates;
            setCoordinates({ lat, lng });
        }

        // Handle polygon if available (complex if format differs, assuming standard)
        // If we don't have polygon points easily available from backend (it might send GeoJSON object), 
        // we might need to parse. For simplicity, we just set registeredId and trust backend has the polygon.
        // We might clear local polygon state to avoid confusion if we can't visualize it easily without parsing.
        setPolygon([]); // Or parse if terrain.poligono exists and matches format

        setRegisteredId(terrain.id);
        setShowTerrainModal(false);
        setErrors({}); // Clear errors
    };

    const validate = () => {
        let valid = true;
        let newErrors: { [key: string]: string } = {};

        if (!locationName) {
            newErrors.locationName = "Nombre de ubicación requerido";
            valid = false;
        }
        if (!coordinates) {
            newErrors.coordinates = "Debes seleccionar una ubicación en el mapa";
            valid = false;
        }
        if (!landSize || isNaN(Number(landSize)) || Number(landSize) <= 0) {
            newErrors.landSize = "Ingresa un área válida en hectáreas";
            valid = false;
        }
        if (!soilCondition) { // Could also validate specific values if needed
            newErrors.soilCondition = "Tipo de suelo requerido";
            valid = false;
        }
        if (!infrastructure || isNaN(Number(infrastructure)) || Number(infrastructure) < 0) {
            newErrors.infrastructure = "Distancia a vías válida requerida (km)";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }


    const router = useRouter();
    const params = useLocalSearchParams();

    // Effect to handle incoming params (auto-selection from History)
    useEffect(() => {
        if (params.terrainId) {
            const id = Number(params.terrainId);
            const loadAndSelect = async () => {
                try {
                    const terrains = await getMyTerrains();
                    setMyTerrains(terrains);
                    const selected = terrains.find((t: any) => t.id === id);
                    if (selected) {
                        handleSelectTerrain(selected);
                    }
                } catch (e) {
                    console.error("Error auto-loading terrain params", e);
                }
            };
            loadAndSelect();
        }
    }, [params.terrainId]);

    // Effect to reset registeredId if inputs change
    useEffect(() => {
    }, []);

    const handleInputChange = (setter: any, value: any) => {
        setter(value);
        if (registeredId) setRegisteredId(null); // Reset if user edits
    };

    const handleRegister = async () => {
        if (!validate()) {
            Alert.alert("Error", "Por favor corrige los errores en el formulario.");
            return null;
        }

        if (polygon.length < 3) {
            Alert.alert("Aviso", "Por favor dibuja el perímetro del terreno en el mapa (mínimo 3 puntos).");
            return null;
        }

        setLoading(true);

        try {
            let polyCoords = polygon.map(p => [p.longitude, p.latitude]);
            if (polyCoords.length > 0) {
                polyCoords.push(polyCoords[0]);
            }

            const payload = {
                ubicacion_nombre: locationName,
                area_hectareas: Number(landSize),
                tipo_suelo: soilCondition.toLowerCase(),
                acceso_riego: waterAccess ? 1 : 0,
                proximidad_vias_km: Number(infrastructure),
                lat: coordinates!.lat,
                lng: coordinates!.lng,
                poligono: {
                    type: "Polygon",
                    coordinates: [polyCoords]
                }
            };

            const result = await createTerrain(payload);

            // Success
            setRegisteredId(result.id);
            Alert.alert("Éxito", "Terreno registrado. Ahora puedes estimar su valor.");
            return result.id;

        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.message || "Error al registrar terreno");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleEstimate = async () => {
        let targetId = registeredId;

        if (!targetId) {
            // "Validar de alguna forma que el terreno ya exista" -> relying on registeredId.

            Alert.alert(
                "Terreno no guardado",
                "Para estimar, primero debemos guardar los datos del terreno. ¿Deseas guardarlo ahora?",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Guardar y Estimar",
                        onPress: async () => {
                            const newId = await handleRegister();
                            if (newId) {
                                setRegisteredId(newId);
                                // Recursive call or straight logic? Straight logic to avoid loop issues
                                performEstimation(newId);
                            }
                        }
                    }
                ]
            );
            return;
        }

        performEstimation(targetId);
    };

    const performEstimation = async (id: number) => {
        setEstimating(true);
        setEstimatedPrice(null);
        try {
            const result = await estimateTerrainPrice(id);
            // Result might be the whole Consulta object
            setEstimatedPrice(`$${Number(result.valor_estimado_hectarea).toFixed(2)} / ha`);
        } catch (error: any) {
            console.error(error);
            Alert.alert("Error", error.response?.data?.message || "Error al estimar valor");
        } finally {
            setEstimating(false);
        }
    };


    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <View>
                    <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary, marginBottom: 0 }]}>
                        Gestión de Terrenos
                    </Text>
                    {user && <Text variant="bodySmall">Hola, {user.name}</Text>}
                </View>
                {/* <Button mode="outlined" onPress={() => signOut()} compact>
          Salir
        </Button> */}
            </View>

            <View style={styles.form}>
                <Button
                    mode="outlined"
                    onPress={handleOpenTerrainModal}
                    icon="folder-open"
                    style={{ marginBottom: 10 }}
                >
                    Seleccionar Mis Terrenos
                </Button>

                <TextInput
                    label="Nombre de Ubicación"
                    placeholder="Ej: Finca La Esperanza"
                    value={locationName}
                    onChangeText={(v) => handleInputChange(setLocationName, v)}
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.locationName}
                />
                {errors.locationName && <HelperText type="error">{errors.locationName}</HelperText>}

                <View>
                    <Button
                        mode="outlined"
                        onPress={() => setShowMapModal(true)}
                        icon="map-marker"
                        style={{ borderColor: errors.coordinates ? 'red' : theme.colors.outline }}
                    >
                        {coordinates ? (polygon.length > 0 ? `Polígono (${polygon.length} ptos)` : `Ubicación Seleccionada`) : "Seleccionar en Mapa"}
                    </Button>
                    {coordinates && <Text variant="bodySmall" style={{ textAlign: 'center', color: 'gray' }}>Lat: {coordinates.lat.toFixed(5)}, Lng: {coordinates.lng.toFixed(5)}</Text>}
                    {errors.coordinates && <HelperText type="error">{errors.coordinates}</HelperText>}
                </View>

                <MapModal
                    visible={showMapModal}
                    onDismiss={() => setShowMapModal(false)}
                    onSelectLocation={handleSelectLocation}
                />


                <TextInput
                    label="Área (Hectáreas)"
                    placeholder="Ej: 15.5"
                    value={landSize}
                    onChangeText={(v) => handleInputChange(setLandSize, v)}
                    keyboardType="numeric"
                    mode="outlined"
                    left={<TextInput.Icon icon="grid" />}
                    style={styles.input}
                    error={!!errors.landSize}
                />
                {errors.landSize && <HelperText type="error">{errors.landSize}</HelperText>}

                <TextInput
                    label="Tipo de Suelo (fertil, medio, pobre)"
                    placeholder="fertil, medio, pobre"
                    value={soilCondition}
                    onChangeText={(v) => handleInputChange(setSoilCondition, v)}
                    mode="outlined"
                    // right={<TextInput.Icon icon="chevron-down" />}
                    style={styles.input}
                    error={!!errors.soilCondition}
                />
                {errors.soilCondition && <HelperText type="error">{errors.soilCondition}</HelperText>}

                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={waterAccess ? 'checked' : 'unchecked'}
                        onPress={() => handleInputChange(setWaterAccess, !waterAccess)}
                        color={theme.colors.primary}
                    />
                    <Text onPress={() => handleInputChange(setWaterAccess, !waterAccess)}>Acceso a agua o riego</Text>
                </View>

                <TextInput
                    label="Distancia a vías principales (km)"
                    placeholder="Ej: 2.5"
                    value={infrastructure}
                    onChangeText={(v) => handleInputChange(setInfrastructure, v)}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    error={!!errors.infrastructure}
                />
                {errors.infrastructure && <HelperText type="error">{errors.infrastructure}</HelperText>}

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <Button
                        mode={registeredId ? "outlined" : "contained"}
                        onPress={handleRegister}
                        loading={loading}
                        disabled={loading || estimating}
                        style={[styles.button, { flex: 1, backgroundColor: registeredId ? 'transparent' : '#4CAF50' }]}
                        labelStyle={[styles.buttonLabel, { color: registeredId ? theme.colors.primary : 'white' }]}
                        icon="content-save"
                    >
                        {registeredId ? "Actualizar" : "Registrar"}
                    </Button>

                    <Button
                        mode="contained"
                        onPress={handleEstimate}
                        loading={estimating}
                        disabled={loading || estimating}
                        style={[styles.button, { flex: 1, backgroundColor: theme.colors.secondary }]}
                        labelStyle={styles.buttonLabel}
                        icon="chart-line-variant"
                    >
                        Estimar
                    </Button>
                </View>
                {registeredId && <Text style={{ textAlign: 'center', color: 'green', fontSize: 12 }}>✓ Terreno sincronizado (ID: {registeredId})</Text>}

            </View>

            {estimatedPrice && (
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <View style={{ flex: 1 }}>
                            <Text variant="titleMedium" style={styles.cardTitle}>Precio Estimado</Text>
                            <Text variant="displayMedium" style={[styles.priceValue, { color: theme.colors.primary }]}>
                                {estimatedPrice}
                            </Text>
                            <Text variant="bodySmall" style={styles.cardDescription}>
                                Nuestro modelo de IA utiliza datos geoespaciales y agrícolas para estimar precios precisos de terrenos rurales
                            </Text>
                        </View>
                        <Avatar.Icon size={48} icon="chart-bar" style={{ backgroundColor: '#E8F5E9' }} color="#4CAF50" />
                    </Card.Content>
                </Card>
            )}

            {/* Terrain Selection Modal using internal Portal/Modal from Paper */}
            <Portal>
                <PaperModal visible={showTerrainModal} onDismiss={() => setShowTerrainModal(false)} contentContainerStyle={styles.modalContent}>
                    <Text variant="headlineSmall" style={{ marginBottom: 10, textAlign: 'center' }}>Mis Terrenos</Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                        {myTerrains.length === 0 ? <Text style={{ textAlign: 'center', padding: 20 }}>No tienes terrenos guardados.</Text> : (
                            myTerrains.map(t => (
                                <View key={t.id}>
                                    <List.Item
                                        title={t.ubicacion_nombre || `Terreno #${t.id}`}
                                        description={`${t.area_hectareas} ha - ${t.tipo_suelo}`}
                                        left={props => <List.Icon {...props} icon="map" />}
                                        onPress={() => handleSelectTerrain(t)}
                                    />
                                    <Divider />
                                </View>
                            ))
                        )}
                    </ScrollView>
                    <Button onPress={() => setShowTerrainModal(false)} style={{ marginTop: 10 }}>Cerrar</Button>
                </PaperModal>
            </Portal>


            {/* Forced spacer for bottom tabs visibility if needed */}
            <View style={{ height: 20 }} />
        </ScrollView>
    );
}
