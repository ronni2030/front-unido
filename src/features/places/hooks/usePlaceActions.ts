import { useState } from 'react';
import { placesService } from '../services/placesService';
import type { PlaceFormData, Place } from '../types/place.types';

export const usePlaceActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPlace = async (data: PlaceFormData): Promise<Place | null> => {
    try {
      setLoading(true);
      setError(null);
      const newPlace = await placesService.createPlace(data);
      return newPlace;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el lugar';
      setError(errorMessage);
      console.error('Error creating place:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePlace = async (id: string, data: Partial<PlaceFormData>): Promise<Place | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedPlace = await placesService.updatePlace(id, data);
      return updatedPlace;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el lugar';
      setError(errorMessage);
      console.error('Error updating place:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePlace = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await placesService.deletePlace(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el lugar';
      setError(errorMessage);
      console.error('Error deleting place:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    createPlace,
    updatePlace,
    deletePlace,
    loading,
    error,
    clearError,
  };
};
