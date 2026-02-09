import { MapModal } from '@/src/views/modals/map.modal';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Checkbox, Text, TextInput, useTheme } from 'react-native-paper';
// Material Community Icons names for reference:
// map-marker, arrow-down-drop-circle, grid, water, chart-line

import { useAuth } from '@/src/providers/AuthProvider';

export default function EstimationScreen() {
  const theme = useTheme();
  const { signOut, user } = useAuth();

  // State for inputs
  const [location, setLocation] = useState('');
  const [landType, setLandType] = useState('');
  const [landSize, setLandSize] = useState('');
  const [soilCondition, setSoilCondition] = useState('');
  const [waterAccess, setWaterAccess] = useState(false);
  const [infrastructure, setInfrastructure] = useState('');

  // Dropdown visibility simulation (Material Menu would be better, but simple toggle for now)
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showSoilMenu, setShowSoilMenu] = useState(false);

  const [showMapModal, setShowMapModal] = useState(false);

  const handleSelectLocation = (coords: { latitude: number; longitude: number }) => {
    setLocation(`Lat: ${coords.latitude.toFixed(4)}, Lng: ${coords.longitude.toFixed(4)}`);
  };

  // Result state
  const [estimatedPrice, setEstimatedPrice] = useState<string | null>(null);

  const handleEstimate = () => {
    // Simulate estimation logic
    setEstimatedPrice('$47,500');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <View>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary, marginBottom: 0 }]}>
            Estimar precio
          </Text>
          {user && <Text variant="bodySmall">Hola, {user.name}</Text>}
        </View>
        {/* <Button mode="outlined" onPress={() => signOut()} compact>
          Salir
        </Button> */}
      </View>

      <View style={styles.form}>
        <TextInput
          label="Ubicación del terreno"
          placeholder="Seleccionar en mapa"
          value={location}
          // specific change: make it essentially read-only or just clickable
          // For UX, sticking to icon click or full click
          mode="outlined"
          left={<TextInput.Icon icon="map-marker" onPress={() => setShowMapModal(true)} forceTextInputFocus={false} />}
          right={<TextInput.Icon icon="crosshairs-gps" onPress={() => setShowMapModal(true)} forceTextInputFocus={false} />}
          style={styles.input}
          editable={false} // Prevent manual entry to force map use
          onPressIn={() => setShowMapModal(true)}
        />

        <MapModal
          visible={showMapModal}
          onDismiss={() => setShowMapModal(false)}
          onSelectLocation={handleSelectLocation}
        />

        {/* Placeholder for Dropdown - simulated with TextInput for visual fidelity to request if full Menu not implemented */}
        <TextInput
          label="Tipo de terreno"
          placeholder="Tipo de terreno"
          value={landType}
          onChangeText={setLandType}
          mode="outlined"
          right={<TextInput.Icon icon="chevron-down" />}
          style={styles.input}
        />

        <TextInput
          label="Tamaño del terreno"
          placeholder="Tamaño del terreno"
          value={landSize}
          onChangeText={setLandSize}
          keyboardType="numeric"
          mode="outlined"
          left={<TextInput.Icon icon="grid" />}
          style={styles.input}
        />

        <TextInput
          label="Condiciones del suelo"
          placeholder="Condiciones del suelo"
          value={soilCondition}
          onChangeText={setSoilCondition}
          mode="outlined"
          right={<TextInput.Icon icon="chevron-down" />}
          style={styles.input}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={waterAccess ? 'checked' : 'unchecked'}
            onPress={() => setWaterAccess(!waterAccess)}
            color={theme.colors.primary}
          />
          <Text onPress={() => setWaterAccess(!waterAccess)}>Acceso a agua o riego</Text>
        </View>

        <TextInput
          label="Infraestructura cercana"
          placeholder="Infraestructura cercana"
          value={infrastructure}
          onChangeText={setInfrastructure}
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleEstimate}
          style={[styles.button, { backgroundColor: '#4CAF50' }]} // Soft green as requested
          labelStyle={styles.buttonLabel}
          icon="chart-line-variant"
          contentStyle={styles.buttonContent}
        >
          Estimar Valor
        </Button>
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

      {/* Forced spacer for bottom tabs visibility if needed */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60, // Top margin
  },
  title: {
    fontWeight: '600',
    marginBottom: 24,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 8, // Rounded border attempt (Paper handles this via theme usually, but can override)
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 8,
    marginTop: 8,
  },
  buttonContent: {
    height: 56, // Prominent height
  },
  buttonLabel: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  card: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#757575',
  },
  priceValue: {
    fontWeight: 'bold',
    marginVertical: 4,
  },
  cardDescription: {
    color: '#9E9E9E',
    marginTop: 4,
    marginRight: 8,
  },
});
