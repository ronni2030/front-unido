import apiClient from '../api/client/apiClient';
import { API_ENDPOINTS } from '../api/endpoints/endpoints';
import type {
  Mensaje,
  CreateMensajeRequest,
  UpdateMensajeRequest,
} from '../../shared/types/message.types';
import type { ApiResponse } from '../../shared/types/api.types';

export const mensajesService = {
  /**
   * Obtener todos los mensajes
   */
  async getAll(): Promise<Mensaje[]> {
    const response = await apiClient.get<ApiResponse<Mensaje[]>>(
      API_ENDPOINTS.mensajes.lista
    );
    return response.data.data;
  },

  /**
   * Obtener mensaje por ID
   */
  async getById(id: number): Promise<Mensaje> {
    const response = await apiClient.get<ApiResponse<Mensaje>>(
      API_ENDPOINTS.mensajes.obtener(id)
    );
    return response.data.data;
  },

  /**
   * Obtener mensajes por tipo
   */
  async getByType(tipoId: number): Promise<Mensaje[]> {
    const response = await apiClient.get<ApiResponse<Mensaje[]>>(
      API_ENDPOINTS.mensajes.tipo(tipoId)
    );
    return response.data.data;
  },

  /**
   * Obtener mensajes urgentes
   */
  async getUrgent(): Promise<Mensaje[]> {
    const response = await apiClient.get<ApiResponse<Mensaje[]>>(
      API_ENDPOINTS.mensajes.urgentes
    );
    return response.data.data;
  },

  /**
   * Crear mensaje
   */
  async create(data: CreateMensajeRequest): Promise<Mensaje> {
    const response = await apiClient.post<ApiResponse<Mensaje>>(
      API_ENDPOINTS.mensajes.crear,
      data
    );
    return response.data.data;
  },

  /**
   * Marcar mensaje como visto
   */
  async markAsViewed(id: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.mensajes.visto(id));
  },

  /**
   * Marcar mensaje como leído
   */
  async markAsRead(id: number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.mensajes.leido(id));
  },

  /**
   * Actualizar mensaje
   */
  async update(id: number, data: UpdateMensajeRequest): Promise<Mensaje> {
    const response = await apiClient.put<ApiResponse<Mensaje>>(
      API_ENDPOINTS.mensajes.actualizar(id),
      data
    );
    return response.data.data;
  },

  /**
   * Eliminar mensaje
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.mensajes.eliminar(id));
  },
};
