import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints/endpoints';
import type { ApiResponse } from '../../../shared/types/api.types';

// Tipos para usuarios
export interface Usuario {
  id: number;
  nameUsers: string;
  emailUser: string;
  userName: string;
  phoneUser: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUsuarioRequest {
  nameUsers: string;
  emailUser: string;
  userName: string;
  passwordUser: string;
  phoneUser: string;
}

export interface UpdateUsuarioRequest {
  nameUsers?: string;
  emailUser?: string;
  phoneUser?: string;
}

// Tipos para roles
export interface Rol {
  id: number;
  nameRol: string;
  descriptionRol?: string;
  estado?: string;
}

// Servicio de Usuarios
export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const response = await apiClient.get<ApiResponse<Usuario[]>>(
      API_ENDPOINTS.usuarios.lista
    );
    return response.data.data;
  },

  async getById(id: number): Promise<Usuario> {
    const response = await apiClient.get<ApiResponse<Usuario>>(
      API_ENDPOINTS.usuarios.obtener(id)
    );
    return response.data.data;
  },

  async search(query: string): Promise<Usuario[]> {
    const response = await apiClient.get<ApiResponse<Usuario[]>>(
      API_ENDPOINTS.usuarios.buscar,
      { params: { q: query } }
    );
    return response.data.data;
  },

  async create(data: CreateUsuarioRequest): Promise<Usuario> {
    const response = await apiClient.post<ApiResponse<Usuario>>(
      API_ENDPOINTS.usuarios.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateUsuarioRequest): Promise<Usuario> {
    const response = await apiClient.put<ApiResponse<Usuario>>(
      API_ENDPOINTS.usuarios.actualizar(id),
      data
    );
    return response.data.data;
  },

  async assignRole(userId: number, roleId: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.usuarios.asignarRol, {
      userId,
      roleId,
    });
  },

  async changeStatus(id: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.usuarios.cambiarEstado(id));
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.usuarios.eliminar(id));
  },
};

// Servicio de Roles
export const rolesService = {
  async getAll(): Promise<Rol[]> {
    const response = await apiClient.get<ApiResponse<Rol[]>>(
      API_ENDPOINTS.roles.lista
    );
    return response.data.data;
  },

  async getById(id: number): Promise<Rol> {
    const response = await apiClient.get<ApiResponse<Rol>>(
      API_ENDPOINTS.roles.obtener(id)
    );
    return response.data.data;
  },

  async search(query: string): Promise<Rol[]> {
    const response = await apiClient.get<ApiResponse<Rol[]>>(
      API_ENDPOINTS.roles.buscar,
      { params: { q: query } }
    );
    return response.data.data;
  },

  async create(data: { nameRol: string; descriptionRol?: string }): Promise<Rol> {
    const response = await apiClient.post<ApiResponse<Rol>>(
      API_ENDPOINTS.roles.crear,
      data
    );
    return response.data.data;
  },

  async getDefault(): Promise<Rol> {
    const response = await apiClient.get<ApiResponse<Rol>>(
      API_ENDPOINTS.roles.porDefecto
    );
    return response.data.data;
  },

  async update(
    id: number,
    data: { nameRol?: string; descriptionRol?: string }
  ): Promise<Rol> {
    const response = await apiClient.put<ApiResponse<Rol>>(
      API_ENDPOINTS.roles.actualizar(id),
      data
    );
    return response.data.data;
  },

  async changeStatus(id: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.roles.cambiarEstado(id));
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.roles.eliminar(id));
  },
};