import { useState } from 'react';
import { Terrain } from '../models/Terrain';

export const useTerrain = () => {
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [loading, setLoading] = useState(false);

    const loadTerrains = async () => {
        setLoading(true);
        try {
            // TODO: Connect to terrainService.getAll()
            // Mocking data for structure demonstration
            await new Promise(resolve => setTimeout(resolve, 1000));
            // setTerrains([x      
            //     { id: 1, nombre: 'Terreno Alpha', ubicacion: 'Zona Norte', area: 10, precio: 50000, descripcion: 'Ideal para maíz' },
            //     { id: 2, nombre: 'Terreno Beta', ubicacion: 'Zona Sur', area: 25, precio: 120000, descripcion: 'Acceso a agua' },
            // ]);
        } catch (error) {
            console.error(error);
            alert('Error al cargar terrenos');
        } finally {
            setLoading(false);
        }
    };

    return { terrains, loadTerrains, loading };
};
