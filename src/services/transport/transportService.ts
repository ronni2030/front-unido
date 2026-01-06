import apiClient from '../api/client/apiClient';
import { API_ENDPOINTS } from '../api/endpoints/endpoints';
import type {
  Cliente,
  CreateClienteRequest,
  UpdateClienteRequest,
  Conductor,
  CreateConductorRequest,
  UpdateConductorRequest,
  Ruta,
  CreateRutaRequest,
  UpdateRutaRequest,
  Estacion,
  CreateEstacionRequest,
  UpdateEstacionRequest,
  Transporte,
  CreateTransporteRequest,
  UpdateTransporteRequest,
  EmpresaTransporte,
  CreateEmpresaRequest,
  UpdateEmpresaRequest,
} from '../../shared/types/transport.types';
import type { ApiResponse } from '../../shared/types/api.types';

// Servicio de Clientes
export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    const response = await apiClient.get<ApiResponse<Cliente[]>>(
      API_ENDPOINTS.clientes.lista
    );
    return response.data.data;
  },

  async create(data: CreateClienteRequest): Promise<Cliente> {
    const response = await apiClient.post<ApiResponse<Cliente>>(
      API_ENDPOINTS.clientes.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateClienteRequest): Promise<Cliente> {
    const response = await apiClient.put<ApiResponse<Cliente>>(
      API_ENDPOINTS.clientes.actualizar(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.clientes.eliminar(id));
  },
};

// Servicio de Conductores
export const conductoresService = {
  async getAll(): Promise<Conductor[]> {
    const response = await apiClient.get<ApiResponse<Conductor[]>>(
      API_ENDPOINTS.conductores.lista
    );
    return response.data.data;
  },

  async create(data: CreateConductorRequest): Promise<Conductor> {
    const response = await apiClient.post<ApiResponse<Conductor>>(
      API_ENDPOINTS.conductores.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateConductorRequest): Promise<Conductor> {
    const response = await apiClient.put<ApiResponse<Conductor>>(
      API_ENDPOINTS.conductores.actualizar(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.conductores.eliminar(id));
  },
};

// Servicio de Rutas
export const rutasService = {
  async getAll(): Promise<Ruta[]> {
    const response = await apiClient.get<ApiResponse<Ruta[]>>(
      API_ENDPOINTS.rutas.lista
    );
    return response.data.data;
  },

  async getById(id: number): Promise<Ruta> {
    const response = await apiClient.get<ApiResponse<Ruta>>(
      API_ENDPOINTS.rutas.obtener(id)
    );
    return response.data.data;
  },

  async getByStation(estacionId: number): Promise<Ruta[]> {
    const response = await apiClient.get<ApiResponse<Ruta[]>>(
      API_ENDPOINTS.rutas.porEstacion(estacionId)
    );
    return response.data.data;
  },

  async create(data: CreateRutaRequest): Promise<Ruta> {
    const response = await apiClient.post<ApiResponse<Ruta>>(
      API_ENDPOINTS.rutas.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateRutaRequest): Promise<Ruta> {
    const response = await apiClient.put<ApiResponse<Ruta>>(
      API_ENDPOINTS.rutas.actualizar(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.rutas.eliminar(id));
  },
};

// Servicio de Estaciones
export const estacionesService = {
  async getAll(): Promise<Estacion[]> {
    const response = await apiClient.get<ApiResponse<Estacion[]>>(
      API_ENDPOINTS.estaciones.lista
    );
    return response.data.data;
  },

  async getById(id: number): Promise<Estacion> {
    const response = await apiClient.get<ApiResponse<Estacion>>(
      API_ENDPOINTS.estaciones.obtener(id)
    );
    return response.data.data;
  },

  async searchByLocation(city: string): Promise<Estacion[]> {
    const response = await apiClient.get<ApiResponse<Estacion[]>>(
      API_ENDPOINTS.estaciones.buscarUbicacion,
      { params: { city } }
    );
    return response.data.data;
  },

  async create(data: CreateEstacionRequest): Promise<Estacion> {
    const response = await apiClient.post<ApiResponse<Estacion>>(
      API_ENDPOINTS.estaciones.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateEstacionRequest): Promise<Estacion> {
    const response = await apiClient.put<ApiResponse<Estacion>>(
      API_ENDPOINTS.estaciones.actualizar(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.estaciones.eliminar(id));
  },
};

// Servicio de Transportes
export const transportesService = {
  async getAll(): Promise<Transporte[]> {
    const response = await apiClient.get<ApiResponse<Transporte[]>>(
      API_ENDPOINTS.transportes.lista
    );
    return response.data.data;
  },

  async getById(id: number): Promise<Transporte> {
    const response = await apiClient.get<ApiResponse<Transporte>>(
      API_ENDPOINTS.transportes.obtener(id)
    );
    return response.data.data;
  },

  async create(data: CreateTransporteRequest): Promise<Transporte> {
    const response = await apiClient.post<ApiResponse<Transporte>>(
      API_ENDPOINTS.transportes.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateTransporteRequest): Promise<Transporte> {
    const response = await apiClient.put<ApiResponse<Transporte>>(
      API_ENDPOINTS.transportes.actualizar(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.transportes.eliminar(id));
  },
};

// Servicio de Empresas de Transporte
export const empresasService = {
  async getAll(): Promise<EmpresaTransporte[]> {
    const response = await apiClient.get<ApiResponse<EmpresaTransporte[]>>(
      API_ENDPOINTS.empresas.lista
    );
    return response.data.data;
  },

  async create(data: CreateEmpresaRequest): Promise<EmpresaTransporte> {
    const response = await apiClient.post<ApiResponse<EmpresaTransporte>>(
      API_ENDPOINTS.empresas.crear,
      data
    );
    return response.data.data;
  },

  async update(id: number, data: UpdateEmpresaRequest): Promise<EmpresaTransporte> {
    const response = await apiClient.put<ApiResponse<EmpresaTransporte>>(
      API_ENDPOINTS.empresas.actualizar(id),
      data
    );
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.empresas.eliminar(id));
  },
};
