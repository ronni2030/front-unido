import { create } from 'zustand';
import { createCardSlice, type CardSlice } from './slices/cardSlice';

// Tipo combinado de todo el store
type AppStore = CardSlice;

// Crear el store unificado
export const useAppStore = create<AppStore>()((...a) => ({
  ...createCardSlice(...a),
}));