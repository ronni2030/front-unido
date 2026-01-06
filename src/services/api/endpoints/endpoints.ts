// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },

  // Usuarios
  usuarios: {
    lista: '/usuarios/lista',
    obtener: (id: number) => `/usuarios/obtener/${id}`,
    buscar: '/usuarios/buscar',
    crear: '/usuarios/crear',
    actualizar: (id: number) => `/usuarios/actualizar/${id}`,
    asignarRol: '/usuarios/asignar-rol',
    cambiarEstado: (id: number) => `/usuarios/cambiar-estado/${id}`,
    eliminar: (id: number) => `/usuarios/eliminar/${id}`,
  },

  // Roles
  roles: {
    lista: '/roles/lista',
    obtener: (id: number) => `/roles/obtener/${id}`,
    buscar: '/roles/buscar',
    crear: '/roles/crear',
    porDefecto: '/roles/por-defecto',
    actualizar: (id: number) => `/roles/actualizar/${id}`,
    cambiarEstado: (id: number) => `/roles/cambiar-estado/${id}`,
    eliminar: (id: number) => `/roles/eliminar/${id}`,
  },

  // Clientes
  clientes: {
    lista: '/clientes/lista',
    crear: '/clientes/crear',
    actualizar: (id: number) => `/clientes/actualizar/${id}`,
    eliminar: (id: number) => `/clientes/eliminar/${id}`,
  },

  // Conductores
  conductores: {
    lista: '/conductores/lista',
    crear: '/conductores/crear',
    actualizar: (id: number) => `/conductores/actualizar/${id}`,
    eliminar: (id: number) => `/conductores/eliminar/${id}`,
  },

  // Rutas
  rutas: {
    lista: '/rutas/lista',
    obtener: (id: number) => `/rutas/obtener/${id}`,
    porEstacion: (id: number) => `/rutas/por-estacion/${id}`,
    crear: '/rutas/crear',
    actualizar: (id: number) => `/rutas/actualizar/${id}`,
    eliminar: (id: number) => `/rutas/eliminar/${id}`,
  },

  // Estaciones
  estaciones: {
    lista: '/estaciones/lista',
    obtener: (id: number) => `/estaciones/obtener/${id}`,
    buscarUbicacion: '/estaciones/buscar-ubicacion',
    crear: '/estaciones/crear',
    actualizar: (id: number) => `/estaciones/actualizar/${id}`,
    eliminar: (id: number) => `/estaciones/eliminar/${id}`,
  },

  // Transportes
  transportes: {
    lista: '/transportes/lista',
    obtener: (id: number) => `/transportes/obtener/${id}`,
    crear: '/transportes/crear',
    actualizar: (id: number) => `/transportes/actualizar/${id}`,
    eliminar: (id: number) => `/transportes/eliminar/${id}`,
  },

  // Mensajes
  mensajes: {
    lista: '/mensajes/lista',
    obtener: (id: number) => `/mensajes/obtener/${id}`,
    tipo: (id: number) => `/mensajes/tipo/${id}`,
    urgentes: '/mensajes/urgentes',
    crear: '/mensajes/crear',
    visto: (id: number) => `/mensajes/visto/${id}`,
    leido: (id: number) => `/mensajes/leido/${id}`,
    actualizar: (id: number) => `/mensajes/actualizar/${id}`,
    eliminar: (id: number) => `/mensajes/eliminar/${id}`,
  },

  // Empresas de Transporte
  empresas: {
    lista: '/empresas/lista',
    crear: '/empresas/crear',
    actualizar: (id: number) => `/empresas/actualizar/${id}`,
    eliminar: (id: number) => `/empresas/eliminar/${id}`,
  },
} as const;
