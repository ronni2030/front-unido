// Tipos para autenticación
export interface RegisterRequest {
  nameUsers: string;
  emailUser: string;
  userName: string;
  passwordUser: string;
  phoneUser: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nameUsers: string;
  emailUser: string;
  userName: string;
  phoneUser: string;
  estado?: string;
  roles?: Role[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Role {
  id: number;
  nameRol: string;
  descriptionRol?: string;
  estado?: string;
}
