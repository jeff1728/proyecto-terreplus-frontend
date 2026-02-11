export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'inversionista' | 'agricultor' | 'admin';
    token?: string;
    foto_perfil?: string;
}
