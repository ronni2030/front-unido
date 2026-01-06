import type { EntityStatus } from '../../../shared/types/api.types';

// Tipos para usuarios
export interface User {
  id: number;
  nameUsers: string;
  emailUser: string;
  userName: string;
  phoneUser: string;
  estado: EntityStatus;
  roles?: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  nameUsers: string;
  emailUser: string;
  userName: string;
  passwordUser: string;
  phoneUser: string;
}

export interface UpdateUserRequest {
  nameUsers?: string;
  emailUser?: string;
  userName?: string;
  phoneUser?: string;
}

export interface AssignRoleRequest {
  usuarioId: number;
  rolId: number;
}

export interface ChangeUserStatusRequest {
  estado: EntityStatus;
}

// Tipos para roles
export interface Role {
  id: number;
  nameRol: string;
  descriptionRol: string;
  estado: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  nameRol: string;
  descriptionRol: string;
}

export interface UpdateRoleRequest {
  nameRol?: string;
  descriptionRol?: string;
}

export interface ChangeRoleStatusRequest {
  estado: EntityStatus;
}
