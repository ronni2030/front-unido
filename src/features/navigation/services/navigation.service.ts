const API_URL = `${import.meta.env.VITE_API_URL}/tracking`;

export const saveNavegacion = async (direccion: string) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      direccion,
      tipo: "navegacion",
    }),
  });

  if (!res.ok) {
    throw new Error("Error al guardar navegación");
  }
};

export const deleteNavegacion = async (id: string) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};