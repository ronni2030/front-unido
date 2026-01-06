import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { usuariosService, rolesService } from '../services/usersService';
import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  Role,
  CreateRoleRequest,
  AssignRoleRequest,
  ChangeUserStatusRequest
} from '../types/user.types';

// Hook para obtener todos los usuarios
export function useUsuarios(options?: UseQueryOptions<User[]>) {
  return useQuery<User[]>({
    queryKey: ['usuarios'],
    queryFn: () => usuariosService.getAll(),
    ...options,
  });
}

// Hook para obtener un usuario por ID
export function useUsuario(id: number, options?: UseQueryOptions<User>) {
  return useQuery<User>({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosService.getById(id),
    enabled: !!id,
    ...options,
  });
}

// Hook para buscar usuarios
export function useBuscarUsuarios(searchTerm: string) {
  return useQuery<User[]>({
    queryKey: ['usuarios', 'search', searchTerm],
    queryFn: () => usuariosService.search(searchTerm),
    enabled: searchTerm.length > 0,
  });
}

// Hook para crear usuario
export function useCrearUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usuariosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

// Hook para actualizar usuario
export function useActualizarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      usuariosService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios', variables.id] });
    },
  });
}

// Hook para asignar rol
export function useAsignarRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignRoleRequest) => usuariosService.assignRole(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios', variables.usuarioId] });
    },
  });
}

// Hook para cambiar estado de usuario
export function useCambiarEstadoUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangeUserStatusRequest }) =>
      usuariosService.changeStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios', variables.id] });
    },
  });
}

// Hook para eliminar usuario
export function useEliminarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usuariosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}

// ========== HOOKS PARA ROLES ==========

// Hook para obtener todos los roles
export function useRoles(options?: UseQueryOptions<Role[]>) {
  return useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: () => rolesService.getAll(),
    ...options,
  });
}

// Hook para crear rol
export function useCrearRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

// Hook para crear roles por defecto
export function useCrearRolesPorDefecto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rolesService.createDefaults(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
