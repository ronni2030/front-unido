import { useState } from 'react';

export const useNavigation = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);

  const startNavigation = (destination: string) => {
    setIsNavigating(true);
    setCurrentRoute(destination);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setCurrentRoute(null);
  };

  return {
    isNavigating,
    currentRoute,
    startNavigation,
    stopNavigation,
  };
};