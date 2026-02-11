import React, { useState, useCallback } from "react";
import { View, StyleSheet, Platform, Keyboard } from "react-native";

import {
  Text,
  useTheme,
  Searchbar,
  ActivityIndicator,
  FAB,
} from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { getMyTerrains } from "@/src/services/terrain.service";
import MapComponent from "./MapComponent";

export default function MapScreen() {
  const theme = useTheme();
  const [terrains, setTerrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Coordenadas actualizadas a Santo Domingo, Ecuador
  const [region, setRegion] = useState({
    latitude: -0.253,
    longitude: -79.1754,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [searching, setSearching] = useState(false);

  const loadTerrains = async () => {
    setLoading(true);
    try {
      const data = await getMyTerrains();

      // CAMBIO DE SEGURIDAD: Validamos que la data sea un array
      // Esto evita el error "Z.map is not a function"
      const validatedData = Array.isArray(data) ? data : [];
      setTerrains(validatedData);

      if (validatedData.length > 0) {
        const first = validatedData.find(
          (t: any) => t.coordenadas && t.coordenadas.coordinates,
        );
        if (first) {
          const [lng, lat] = first.coordenadas.coordinates;
          setRegion((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
          }));
        }
      }
    } catch (error) {
      console.error("Error loading terrains for map:", error);
      setTerrains([]); // Si hay error, garantizamos que el estado sea un array vacío
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTerrains();
    }, []),
  );

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    Keyboard.dismiss();
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        console.log("No results found for location");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar ciudad o región..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          onIconPress={handleSearch}
          loading={searching}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text>Cargando mapa...</Text>
          </View>
        ) : (
          <MapComponent
            // Seguridad extra: si terrains no es array, enviamos []
            terrains={Array.isArray(terrains) ? terrains : []}
            region={region}
            onRegionChange={setRegion}
          />
        )}
      </View>

      <FAB
        icon="crosshairs-gps"
        style={styles.fab}
        onPress={() => {
          loadTerrains();
        }}
        label={Platform.OS === "web" ? "Centrar" : ""}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchbar: {
    borderRadius: 8,
    elevation: 4,
  },
  mapContainer: {
    flex: 1,
    marginTop: 0,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
