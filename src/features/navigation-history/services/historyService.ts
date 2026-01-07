//este código se encarga de hablar con la base de datos (MySQL) para que los viajes queden guardados permanentemente.
import api from '../../../services/api/client';
import type { Route } from '../types/history.types';

export const historyService = {
  getHistory: async (): Promise<Route[]> => {
    try {
      // ⚠️ ID FIJO (2) por ahora. Cambiar por userStore.id en producción.
      const response = await api.get('/rutas/historial/2');
      return response.data; // El backend ya devuelve el formato correcto [{ id, origin, destination, date, isFavorite }]
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  },

  // Esta función ahora maneja tanto crear como actualizar favorita,
  // aunque idealmente deberían ser métodos separados.
  saveRoute: async (route: Route): Promise<void> => {
    try {
      if (route.id) {
        // Si tiene ID, asumimos que es para actualizar 'Favorita' (única edición permitida en historial)
        await api.put(`/rutas/favorita/${route.id}`, {
          esFavorita: route.isFavorite
        });
      } else {
        // Crear nueva ruta
        await api.post('/rutas/guardar', {
          userId: 2,
          origen: route.origin,
          destino: route.destination,
          fecha: route.date
        });
      }
    } catch (error) {
      console.error('Error guardando ruta:', error);
      throw error;
    }
  },

  deleteRoute: async (id: string): Promise<void> => {
    try {
      await api.delete(`/rutas/eliminar/${id}`);
    } catch (error) {
      console.error('Error eliminando ruta:', error);
      throw error;
    }
  },

  clearHistory: async (): Promise<void> => {
    // No implementado en backend aún (requeriría endpoint DELETE /rutas/todos/:userId)
    console.warn('clearHistory no soportado en backend por ahora');
  }
};