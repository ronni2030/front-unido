import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

// Hook para login
export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      // Redirigir al dashboard después del login exitoso
      navigate('/dashboard');
    },
  });
}

// Hook para registro
export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      // Redirigir al dashboard después del registro exitoso
      navigate('/dashboard');
    },
  });
}

// Hook para logout
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Limpiar cache de React Query
      queryClient.clear();
      // Redirigir al login
      navigate('/login');
    },
  });
}

// Hook para verificar autenticación
export function useAuth() {
  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getToken();

  return {
    isAuthenticated,
    token,
  };
}
