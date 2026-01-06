import apiClient from '../../../services/api/client/apiClient';
import { API_ENDPOINTS } from '../../../services/api/endpoints/endpoints';
import type { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse 
} from '../types/auth.types';
import type { ApiResponse } from '../../../shared/types/api.types';

export const authService = {
  /**
   * Registrar un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.auth.register,
      data
    );
    
    // Guardar token si viene en la respuesta
    if (response.data.data.token) {
      localStorage.setItem('authToken', response.data.data.token);
    }
    
    return response.data.data;
  },

  /**
   * Iniciar sesión
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.auth.login,
      data
    );
    
    // Guardar tokens
    const authData = response.data.data;
    if (authData.token) {
      localStorage.setItem('authToken', authData.token);
    }
    if (authData.accessToken) {
      localStorage.setItem('authToken', authData.accessToken);
    }
    if (authData.refreshToken) {
      localStorage.setItem('refreshToken', authData.refreshToken);
    }
    
    return authData;
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout);
    } finally {
      // Limpiar tokens incluso si falla la petición
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<AuthResponse> {
    const response = await apiClient.get<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.auth.profile
    );
    return response.data.data;
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
};
