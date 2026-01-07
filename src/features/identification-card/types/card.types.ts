//exporta todo lo relacionado a la tarjeta de identificacion
export interface IdentificationCard {
  name: string;
  bloodType: string;
  allergies: string;
  id?: string;
  isActive?: boolean;
}