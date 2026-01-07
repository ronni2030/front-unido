//exporta todo lo relacionado a el historial de rutas

export interface Route {  // <--- Asegúrate de que diga 'export'
  id: string;
  origin: string;
  destination: string;
  date: string;
  duration: string;
  isFavorite: boolean;
}

