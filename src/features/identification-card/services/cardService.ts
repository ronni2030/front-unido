//donde se comunica el front con el backend
import type { IdentificationCard } from '../types/card.types';

export const cardService = {
  getCard: async (): Promise<IdentificationCard | null> => {
    try {
      const response = await fetch('https://tu-api.com/api/card');
      return await response.json();
    } catch (e) {
      return null;
    }
  },

  saveCard: async (card: IdentificationCard): Promise<void> => {
    try {
      await fetch('https://tu-api.com/api/card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });
    } catch (e) {
      console.warn("Backend no disponible, guardando solo en local.");
    }
  },

  // ESTA ES LA FUNCIÓN QUE FALTABA:
  revokeCard: async (id: number): Promise<void> => {
    try {
      await fetch(`https://tu-api.com/api/card/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn("Backend no disponible, eliminando solo en local.");
    }
  }
};