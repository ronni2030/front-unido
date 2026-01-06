// Exportar todos los servicios desde un único punto
export { authService } from '../features/auth/services/authService';
export { usuariosService, rolesService } from '../features/users/services/usersService';
export { 
  clientesService, 
  conductoresService, 
  rutasService, 
  estacionesService, 
  transportesService, 
  empresasService 
} from './transport/transportService';
export { mensajesService } from './messages/messagesService';

// Exportar el cliente API para usos personalizados
export { default as apiClient } from './api/client/apiClient';

// Exportar endpoints para referencia
export { API_ENDPOINTS } from './api/endpoints/endpoints';
