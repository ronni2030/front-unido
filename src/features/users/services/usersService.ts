import apiClient from '../../../services/api/client/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints/endpoints';
import type { 
  User,
  CreateUserRequest,
  UpdateUserRequest,
  AssignRoleRequest,
  ChangeUserStatusRequest,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ChangeRoleStatusRequest
} from '../types/user.types';
import type { ApiResponse } from '../../../shared/types/api.types';

// Servicio de Usuarios
export const usuariosService = {
  /**
   * Obtener todos los usuarios
   */
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.usuarios.lista
    );
    return response.data.data;
  },

  /**
   * Obtener usuario por ID
   */
  async getById(id: number): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.usuarios.obtener(id)
    );
    return response.data.data;
  },

  /**
   * Buscar usuarios
   */
  async search(searchTerm: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.usuarios.buscar,
      { params: { search: searchTerm } }
    );
    return response.data.data;
  },

  /**
   * Crear usuario
   */
  async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.usuarios.crear,
      data
    );
    return response.data.data;
  },

  /**
   * Actualizar usuario
   */
  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.usuarios.actualizar(id),
      data
    );
    return response.data.data;
  },

  /**
   * Asignar rol a usuario
   */
  async assignRole(data: AssignRoleRequest): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.usuarios.asignarRol,
      data
    );
  },

  /**
   * Cambiar estado del usuario
   */
  async changeStatus(id: number, data: ChangeUserStatusRequest): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.usuarios.cambiarEstado(id),
      data
    );
    return response.data.data;
  },

  /**
   * Eliminar usuario
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.usuarios.eliminar(id));
  },
};

// Servicio de Roles
export const rolesService = {
  /**
   * Obtener todos los roles
   */
  async getAll(): Promise<Role[]> {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      API_ENDPOINTS.roles.lista
    );
    return response.data.data;
  },

  /**
   * Obtener rol por ID
   */
  async getById(id: number): Promise<Role> {
    const response = await apiClient.get<ApiResponse<Role>>(
      API_ENDPOINTS.roles.obtener(id)
    );
    return response.data.data;
  },

  /**
   * Buscar roles
   */
  async search(searchTerm: string): Promise<Role[]> {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      API_ENDPOINTS.roles.buscar,
      { params: { search: searchTerm } }
    );
    return response.data.data;
  },

  /**
   * Crear rol
   */
  async create(data: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post<ApiResponse<Role>>(
      API_ENDPOINTS.roles.crear,
      data
    );
    return response.data.data;
  },

  /**
   * Crear roles por defecto
   */
  async createDefaults(): Promise<Role[]> {
    const response = await apiClient.post<ApiResponse<Role[]>>(
      API_ENDPOINTS.roles.porDefecto
    );
    return response.data.data;
  },

  /**
   * Actualizar rol
   */
  async update(id: number, data: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.put<ApiResponse<Role>>(
      API_ENDPOINTS.roles.actualizar(id),
      data
    );
    return response.data.data;
  },

  /**
   * Cambiar estado del rol
   */
  async changeStatus(id: number, data: ChangeRoleStatusRequest): Promise<Role> {
    const response = await apiClient.put<ApiResponse<Role>>(
      API_ENDPOINTS.roles.cambiarEstado(id),
      data
    );
    return response.data.data;
  },

  /**
   * Eliminar rol
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.roles.eliminar(id));
  },
};
