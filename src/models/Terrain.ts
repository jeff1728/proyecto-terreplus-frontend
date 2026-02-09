export interface Terrain {
    id: number;
    nombre: string;
    ubicacion: string;
    area: number; // en hectareas o m2
    precio: number;
    descripcion?: string;
    imagenUrl?: string;
    latitud?: number;
    longitud?: number;
}