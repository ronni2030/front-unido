export type TrackingItem = {
  id: number;
  direccion: string;
  tipo: "ubicacion" | "navegacion";
  created_at: string;
  destino?: string | null;
};


export interface TrackingUbicacion {
  id: string;
  direccion: string;
  created_at: string;
  tipo: "ubicacion" | "navegacion";
}