const API_URL = "http://localhost:8888/tracking";

// 📡 GET historial
export const getTracking = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener historial");
  return res.json();
};

// 📍 POST ubicación
export const saveUbicacion = async (direccion: string) => {
  const res = await fetch(`${API_URL}/ubicacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direccion }),
  });

  if (!res.ok) throw new Error("Error al guardar ubicación");
  return res.json();
};

// 🧭 POST navegación
export const saveNavegacion = async (direccion: string) => {
  const res = await fetch(`${API_URL}/navegacion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direccion }),
  });

  if (!res.ok) throw new Error("Error al guardar navegación");
  return res.json();
};

// ✏️ PUT actualizar dirección
export const updateTracking = async (id: number, direccion: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direccion }),
  });

  if (!res.ok) throw new Error("Error al actualizar");
  return res.json();
};

// ❌ DELETE
export const deleteTracking = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar");
};
