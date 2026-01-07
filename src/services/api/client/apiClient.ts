import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';

// Crear instancia de axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para manejar cookies/sesiones si el backend lo requiere
});

// Interceptor de solicitudes - añadir token de autenticación y logs
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Añadir token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Puedes agregar logs de depuración aquí si es necesario
    // console.log('Request:', config.method?.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas - manejo de errores y logs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Log de errores
    console.error('API Error:', error.response?.data?.message || error.message);
    
    const originalRequest = error.config;

    // Si el token ha expirado (401) y no se ha reintentado aún
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Intentar refrescar el token si existe
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Aquí podrías llamar a un endpoint de refresh token si lo tienes
          // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          // const newToken = response.data.token;
          // localStorage.setItem('authToken', newToken);
          // originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // return api(originalRequest);
        } catch (refreshError) {
          // Si falla el refresh, limpiar tokens y redirigir al login
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token, limpiar y redirigir
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;