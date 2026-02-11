import api from './api';

// Interfaz para la respuesta del Dashboard
export interface DashboardData {
    kpis: {
        terrenosRegistrados: number;
        usuariosNuevos: number;
        zonasCubiertas: number;
        precisionIA: string;
    };
    precisionMensual: {
        mes: string;
        promedio: string;
    }[];
    zonasMasActivas: {
        zona: string;
        cantidad: number;
    }[];
    terrenosRecientes: {
        zona: string;
        area: number;
        suelo: string;
    }[];
    distribucionSuelo: {
        tipo: string;
        cantidad: number;
    }[];
}

// Servicio para obtener los datos del Dashboard
export const getDashboardStats = async (): Promise<DashboardData> => {
    try {
        const response = await api.get('/dashboard/estadisticas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener estadísticas del dashboard:', error);
        throw error;
    }
};
