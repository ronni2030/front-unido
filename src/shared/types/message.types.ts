import type { MessagePriority, EntityStatus } from './api.types';

// Tipos para Mensajes
export interface Mensaje {
  id: number;
  titleMensaje: string;
  contentMensaje: string;
  priorityMensaje: MessagePriority;
  visto: boolean;
  leido: boolean;
  tipoMensajeId: number;
  usuarioId: number;
  estado?: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMensajeRequest {
  titleMensaje: string;
  contentMensaje: string;
  priorityMensaje: MessagePriority;
  tipoMensajeId: number;
  usuarioId: number;
}

export interface UpdateMensajeRequest {
  titleMensaje?: string;
  contentMensaje?: string;
  priorityMensaje?: MessagePriority;
}

// Tipos para Tipos de Mensaje
export interface TipoMensaje {
  id: number;
  name: string;
  description?: string;
  estado?: EntityStatus;
}
