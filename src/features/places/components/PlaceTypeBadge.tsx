import type { PlaceType } from '../types/place.types';

interface PlaceTypeBadgeProps {
  type: PlaceType;
  className?: string;
}

const placeTypeConfig: Record<PlaceType, { label: string; color: string; bgColor: string; emoji: string }> = {
  'parada segura': {
    label: 'Parada Segura',
    color: 'white',
    bgColor: '#8B1E3F',
    emoji: '🛑',
  },
  'destino frecuente': {
    label: 'Destino Frecuente',
    color: 'white',
    bgColor: '#7A3EB1',
    emoji: '📍',
  },
  'casa': {
    label: 'Casa',
    color: 'white',
    bgColor: '#1F7A6F',
    emoji: '🏠',
  },
  'trabajo': {
    label: 'Trabajo',
    color: 'white',
    bgColor: '#4B1F6F',
    emoji: '💼',
  },
};

export const PlaceTypeBadge = ({ type, className = '' }: PlaceTypeBadgeProps) => {
  const config = placeTypeConfig[type];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black shadow-md ${className}`}
      style={{ backgroundColor: config.bgColor, color: config.color }}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  );
};