//es una Memoria de Corto Plazo para guardar los datos de la tarjeta de identificacion
import type { StateCreator } from 'zustand';
import type { IdentificationCard } from '../../features/identification-card/types/card.types';

export interface CardSlice {
  card: IdentificationCard | null;
  setCard: (card: IdentificationCard) => void;
  clearCard: () => void;
}

export const createCardSlice: StateCreator<CardSlice> = (set) => ({
  card: null,
  setCard: (card) => set({ card }),
  clearCard: () => set({ card: null }),
});