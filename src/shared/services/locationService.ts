export const locationService = {
  // Obtiene las coordenadas actuales
  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Tu dispositivo no soporta GPS");
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  },

  // Traduce coordenadas a nombre de calle (Reverse Geocoding)
  // Usaremos OpenStreetMap (Gratis) para esto
  getAddressFromCoords: async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      // Retornamos la calle o un formato amigable
      return data.address.road || data.display_name.split(',')[0] || "Ubicación desconocida";
    } catch (error) {
      return "No se pudo obtener el nombre de la calle";
    }
  }
};