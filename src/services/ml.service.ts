import api from './api';

export const estimateTerrainPrice = async (terreno_id: number, modelo_id: number = 32) => {
    try {
        const response = await api.post('/ml/estimate', {
            terreno_id,
            modelo_id
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
