import apiClient from '../../../services/api/client/apiClient';
import type { Place, PlaceFormData, PlacesListResponse, PlaceType } from '../types/place.types';

// Servicio de lugares favoritos - Conectado directamente al API
export const placesService = {
  /**
   * Obtener todos los lugares con paginación y filtros
   */
  async getPlaces(page = 1, limit = 10, filters?: { search?: string; type?: string }): Promise<PlacesListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.type && { type: filters.type }),
    });

    const response = await apiClient.get<{
      success: boolean;
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/places?${params}`);
    
    // Mapear la respuesta del backend a la estructura esperada por el frontend
    const mappedResponse: PlacesListResponse = {
      places: response.data.data.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        address: item.address || '',
        description: item.description || '',
        type: decodeURIComponent(item.type || '') as PlaceType, // Decodificar "destino%20frecuente"
        latitude: item.latitude || 0,
        longitude: item.longitude || 0,
        userId: '', // El backend no lo envía, usar valor por defecto
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
      pagination: response.data.pagination,
    };
    
    return mappedResponse;
  },

  /**
   * Obtener un lugar por ID
   */
  async getPlaceById(id: string): Promise<Place> {
    const response = await apiClient.get<Place>(`/places/${id}`);
    return response.data;
  },

  /**
   * Crear un nuevo lugar
   */
  async createPlace(data: PlaceFormData): Promise<Place> {
    const response = await apiClient.post<Place>('/places', data);
    return response.data;
  },

  /**
   * Actualizar un lugar existente
   */
  async updatePlace(id: string, data: Partial<PlaceFormData>): Promise<Place> {
    const response = await apiClient.put<Place>(`/places/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar un lugar
   */
  async deletePlace(id: string): Promise<void> {
    await apiClient.delete(`/places/${id}`);
  },

  /**
   * Obtener lugares por tipo
   */
  async getPlacesByType(type: string): Promise<Place[]> {
    const response = await apiClient.get<Place[]>(`/places/type/${type}`);
    return response.data;
  },

  /**
   * Obtener lugares cercanos basado en coordenadas
   */
  async getNearbyPlaces(latitude: number, longitude: number, radius = 1000): Promise<Place[]> {
    const response = await apiClient.get<Place[]>(`/places/nearby`, {
      params: { latitude, longitude, radius },
    });
    return response.data;
  },
};
