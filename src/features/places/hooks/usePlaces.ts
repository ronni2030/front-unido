import { useState, useEffect } from 'react';
import { placesService } from '../services/placesService';
import type { Place, PlaceFiltersState, PlacesListResponse } from '../types/place.types';

export const usePlaces = (page = 1, limit = 10) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlaceFiltersState>({
    search: '',
    type: undefined,
  });

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PlacesListResponse = await placesService.getPlaces(page, limit, {
        search: filters.search,
        type: filters.type,
      });
      setPlaces(response.places);
      setTotal(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar lugares');
      console.error('Error fetching places:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [page, limit, filters]);

  const updateFilters = (newFilters: Partial<PlaceFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ search: '', type: undefined });
  };

  return {
    places,
    total,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchPlaces,
  };
};

export const usePlace = (id: string) => {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await placesService.getPlaceById(id);
        setPlace(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el lugar');
        console.error('Error fetching place:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlace();
    }
  }, [id]);

  return { place, loading, error };
};
