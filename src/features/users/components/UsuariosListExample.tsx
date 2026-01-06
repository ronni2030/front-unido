import { useState, useEffect } from 'react';
import { usuariosService } from '../../../services';
import type { User } from '../types/user.types';

/**
 * Ejemplo de componente que usa los servicios de usuarios directamente
 * sin necesidad de React Query
 */
export function UsuariosListExample() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.getAll();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsuarios();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.search(searchTerm);
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await usuariosService.delete(id);
      // Recargar la lista
      loadUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={loadUsuarios}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar usuarios..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Buscar
        </button>
        <button
          onClick={loadUsuarios}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Limpiar
        </button>
      </div>

      {/* Lista de usuarios */}
      {usuarios.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No se encontraron usuarios</p>
      ) : (
        <div className="grid gap-4">
          {usuarios.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.nameUsers}
                  </h3>
                  <p className="text-sm text-gray-600">@{user.userName}</p>
                  <p className="text-sm text-gray-600">{user.emailUser}</p>
                  <p className="text-sm text-gray-600">{user.phoneUser}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        user.estado === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.estado}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
