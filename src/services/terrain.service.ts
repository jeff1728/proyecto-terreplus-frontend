import api from './api';

export const createTerrain = async (data: {
    poligono?: any;
    area_hectareas: number;
    tipo_suelo: string;
    acceso_riego: number;
    proximidad_vias_km: number;
    ubicacion_nombre: string;
    lat: number;
    lng: number;
}) => {
    try {
        const response = await api.post('/terrain', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyTerrains = async () => {
    try {
        const response = await api.get('/terrain/my-list');
        return response.data;
    } catch (error) {
        throw error;
    }
};
