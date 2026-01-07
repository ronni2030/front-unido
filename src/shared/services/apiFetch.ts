const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
};
