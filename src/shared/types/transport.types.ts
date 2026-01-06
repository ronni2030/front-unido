import type { EntityStatus } from './api.types';

// Tipos para Clientes
export interface Cliente {
  id: number;
  nameCliente: string;
  emailCliente: string;
  phoneCliente: string;
  addressCliente: string;
  usuarioId: number;
  estado?: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteRequest {
  nameCliente: string;
  emailCliente: string;
  phoneCliente: string;
  addressCliente: string;
  usuarioId: number;
}

export interface UpdateClienteRequest {
  nameCliente?: string;
  emailCliente?: string;
  phoneCliente?: string;
  addressCliente?: string;
}

// Tipos para Conductores
export interface Conductor {
  id: number;
  nameConductor: string;
  licenseNumber: string;
  phoneConductor: string;
  empresaId: number;
  usuarioId: number;
  estado?: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConductorRequest {
  nameConductor: string;
  licenseNumber: string;
  phoneConductor: string;
  empresaId: number;
  usuarioId: number;
}

export interface UpdateConductorRequest {
  nameConductor?: string;
  licenseNumber?: string;
  phoneConductor?: string;
}

// Tipos para Rutas
export interface Ruta {
  id: number;
  nameRuta: string;
  originRuta: string;
  destinationRuta: string;
  distanceRuta: number;
  durationRuta: number;
  empresaId: number;
  estado?: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRutaRequest {
  nameRuta: string;
  originRuta: string;
  destinationRuta: string;
  distanceRuta: number;
  durationRuta: number;
  empresaId: number;
}

export interface UpdateRutaRequest {
  nameRuta?: string;
  originRuta?: string;
  destinationRuta?: string;
  distanceRuta?: number;
  durationRuta?: number;
}

// Tipos para Estaciones
export interface Estacion {
  id: number;
  nameEstacion: string;
  addressEstacion: string;
  cityEstacion: string;
  capacityEstacion: number;
  categoriaId: number;
  estado?: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEstacionRequest {
  nameEstacion: string;
  addressEstacion: string;
  cityEstacion: string;
  capacityEstacion: number;
  categoriaId: number;
}

export interface UpdateEstacionRequest {
  nameEstacion?: string;
  addressEstacion?: string;
  cityEstacion?: string;
  capacityEstacion?: number;
}

// Tipos para Transportes
export interface Transporte {
  id: number;
  plateTransporte: string;
  modelTransporte: string;
  capacityTransporte: number;
  yearTransporte: number;
  empresaId: number;
  categoriaId: number;
  estado?: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransporteRequest {
  plateTransporte: string;
  modelTransporte: string;
  capacityTransporte: number;
  yearTransporte: number;
  empresaId: number;
  categoriaId: number;
}

export interface UpdateTransporteRequest {
  modelTransporte?: string;
  capacityTransporte?: number;
  plateTransporte?: string;
}

// Tipos para Empresas de Transporte
export interface EmpresaTransporte {
  id: number;
  nameEmpresa: string;
  rucEmpresa: string;
  emailEmpresa: string;
  phoneEmpresa: string;
  addressEmpresa: string;
  estado?: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmpresaRequest {
  nameEmpresa: string;
  rucEmpresa: string;
  emailEmpresa: string;
  phoneEmpresa: string;
  addressEmpresa: string;
}

export interface UpdateEmpresaRequest {
  nameEmpresa?: string;
  rucEmpresa?: string;
  emailEmpresa?: string;
  phoneEmpresa?: string;
  addressEmpresa?: string;
}
