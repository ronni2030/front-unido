import type { PlaceType } from '../types/place.types';
import { Search } from 'lucide-react';

interface PlaceFiltersProps {
  search: string;
  type?: PlaceType;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: PlaceType | undefined) => void;
  onClear: () => void;
}

const placeTypes: { value: PlaceType; label: string }[] = [
  { value: 'parada segura', label: 'Parada Segura' },
  { value: 'destino frecuente', label: 'Destino Frecuente' },
  { value: 'casa', label: 'Casa' },
  { value: 'trabajo', label: 'Trabajo' },
];

export const PlaceFilters = ({ search, type, onSearchChange, onTypeChange, onClear }: PlaceFiltersProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Búsqueda */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#7A3EB1' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar lugares..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:border-opacity-100"
              style={{ 
                borderColor: '#B983FF', 
                color: '#1B1026',
                backgroundColor: '#F6F1FB'
              }}
            />
          </div>
        </div>

        {/* Tipo de lugar */}
        <div className="flex gap-2">
          <select
            value={type || ''}
            onChange={(e) => onTypeChange(e.target.value ? (e.target.value as PlaceType) : undefined)}
            className="flex-1 px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none focus:border-opacity-100"
            style={{ 
              borderColor: '#B983FF', 
              color: '#1B1026',
              backgroundColor: '#F6F1FB'
            }}
          >
            <option value="">Todos los tipos</option>
            {placeTypes.map((placeType) => (
              <option key={placeType.value} value={placeType.value}>
                {placeType.label}
              </option>
            ))}
          </select>

          {/* Botón limpiar filtros */}
          {(search || type) && (
            <button
              onClick={onClear}
              className="px-4 py-3 text-sm font-medium rounded-xl transition-all hover:opacity-90"
              style={{ backgroundColor: '#8B1E3F', color: 'white' }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
