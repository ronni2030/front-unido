// Types para la gestión de lugares favoritos
export type PlaceType = 'parada segura' | 'destino frecuente' | 'casa' | 'trabajo';

export interface Place {
  id: string;
  name: string;
  address: string;
  description: string;
  type: PlaceType;
  latitude: number;
  longitude: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceFormData {
  name: string;
  address: string;
  description: string;
  type: PlaceType;
  latitude: number;
  longitude: number;
}

export interface PlaceFiltersState {
  search: string;
  type?: PlaceType;
}

export interface PlacesListResponse {
  places: Place[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
