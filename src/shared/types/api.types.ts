// Tipos base para respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Estados comunes
export type EntityStatus = 'activo' | 'inactivo' | 'suspendido';
export type MessagePriority = 'baja' | 'media' | 'alta' | 'urgente';
