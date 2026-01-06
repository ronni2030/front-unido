import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { usePlaceActions } from '../hooks/usePlaceActions';
import { PlaceCard } from '../components/PlaceCard';
import { useVoiceNavigation } from '../../../shared/hooks/useVoiceNavigation';
import { Plus } from 'lucide-react';

export const FavoritePlacesListScreen = () => {
  const renderCount = useRef(0);
  renderCount.current++;
  console.log(`🔄 [FavoritePlacesListScreen] Render #${renderCount.current}`);
  
  const navigate = useNavigate();
  const currentPage = 1;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | number | null>(null);
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);
  
  console.log('📊 [FavoritePlacesListScreen] Estado actual:', { 
    showDeleteConfirm, 
    hasSpokenWelcome, 
    currentPage 
  });
  
  const { places, total, loading, error, updateFilters, clearFilters, refetch } = usePlaces(currentPage, 10);
  const { deletePlace, loading: actionLoading } = usePlaceActions();
  
  console.log('📍 [FavoritePlacesListScreen] Datos de usePlaces:', { 
    placesCount: places?.length, 
    total, 
    loading, 
    error 
  });

  const { speak } = useVoiceNavigation({
    onCommand: (command) => {
      console.log('📢 Comando recibido en FavoritePlacesListScreen:', command);
      
      // Escuchar lugares guardados
      if (command.includes('escuchar') || command.includes('leer') || command.includes('lista') || command.includes('guardados')) {
        console.log('✅ Ejecutando readPlacesAloud');
        readPlacesAloud();
        return;
      }
      
      // Buscar lugar por nombre
      if (command.includes('buscar')) {
        const searchTerm = command.replace('buscar', '').trim();
        if (searchTerm) {
          updateFilters({ search: searchTerm });
          speak(`Buscando lugares que contengan ${searchTerm}`);
        }
        return;
      }

      // Filtrar por tipo
      if (command.includes('filtrar casa') || command.includes('mostrar casas')) {
        updateFilters({ type: 'casa' });
        speak('Mostrando solo lugares de tipo casa');
        return;
      }
      if (command.includes('filtrar trabajo') || command.includes('mostrar trabajos')) {
        updateFilters({ type: 'trabajo' });
        speak('Mostrando solo lugares de tipo trabajo');
        return;
      }
      if (command.includes('filtrar parada') || command.includes('mostrar paradas')) {
        updateFilters({ type: 'parada segura' });
        speak('Mostrando solo paradas seguras');
        return;
      }
      if (command.includes('limpiar filtro') || command.includes('mostrar todos')) {
        clearFilters();
        speak('Mostrando todos los lugares');
        return;
      }

      // Navegar por número
      if (command.includes('editar número') || command.includes('editar lugar número')) {
        const num = parseInt(command.match(/\d+/)?.[0] || '0');
        if (num > 0 && places && places[num - 1]) {
          speak(`Editando ${places[num - 1].name}`);
          navigate(`/places/${places[num - 1].id}`);
        }
        return;
      }

      if (command.includes('eliminar número') || command.includes('eliminar lugar número')) {
        const num = parseInt(command.match(/\d+/)?.[0] || '0');
        if (num > 0 && places && places[num - 1]) {
          speak(`¿Confirmas eliminar ${places[num - 1].name}? Di sí para confirmar`);
          setShowDeleteConfirm(places[num - 1].id);
        }
        return;
      }

      // Confirmar eliminación
      if (showDeleteConfirm && (command.includes('sí') || command.includes('si') || command.includes('confirmar'))) {
        speak('Eliminando lugar');
        handleDelete(showDeleteConfirm);
        return;
      }
      if (showDeleteConfirm && (command.includes('no') || command.includes('cancelar'))) {
        speak('Cancelado');
        setShowDeleteConfirm(null);
        return;
      }
    },
    enabled: true,
  });

  // Mensaje de bienvenida con voz
  useEffect(() => {
    if (!hasSpokenWelcome && !loading) {
      const timer = setTimeout(() => {
        const welcomeMsg = 'Bienvenido a Open Blind. Te encuentras en lugares favoritos. ¿Deseas crear lugar o escuchar lugares guardados?';
        speak(welcomeMsg);
        setHasSpokenWelcome(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [loading, hasSpokenWelcome]); // Removido 'speak' de las dependencias

  const readPlacesAloud = () => {
    console.log('📢 readPlacesAloud llamado');
    console.log('📍 Lugares disponibles:', places?.length);
    
    if (!places || places.length === 0) {
      console.log('⚠️ No hay lugares para leer');
      speak('No hay lugares favoritos guardados');
      return;
    }

    console.log('✅ Leyendo', places.length, 'lugares');
    speak(`Tienes ${places.length} ${places.length === 1 ? 'lugar' : 'lugares'}. Te los leo:`);
    
    places.forEach((place, index) => {
      setTimeout(() => {
        const message = `Número ${index + 1}. ${place.name}. Tipo: ${place.type}. Ubicado en ${place.address}. ${place.description ? 'Descripción: ' + place.description : ''}`;
        console.log(`🔊 Leyendo lugar ${index + 1}:`, place.name);
        speak(message);
      }, (index + 1) * 5000); // 5 segundos entre cada lugar
    });
  };

  const handleDelete = async (id: string | number) => {
    const success = await deletePlace(String(id));
    if (success) {
      setShowDeleteConfirm(null);
      refetch();
    }
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#1B1026' }}>
      {/* Header */}
      <div className="p-6 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-black text-white">
              Lugares
            </h1>
            <button
              onClick={() => speak('Prueba de audio. Si escuchas esto, el audio funciona correctamente.')}
              className="px-4 py-2 rounded-lg text-white font-semibold text-sm hover:bg-opacity-30 transition-all"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              🔊
            </button>
          </div>
          <p className="text-white text-lg font-medium opacity-70">
            Gestiona tus destinos frecuentes
          </p>
        </div>

        {/* Botón Agregar nuevo lugar */}
        <div className="px-5 pb-5">
          <button
            onClick={() => navigate('/places/add')}
            className="big-button secondary w-full"
          >
            <Plus className="w-8 h-8" strokeWidth={3} />
            <span>Agregar nuevo lugar</span>
          </button>
        </div>

        {/* Título de la lista */}
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h2 className="text-xl font-black text-white">
            Mis Destinos ({total})
          </h2>
          {places && places.length > 0 && (
            <button className="text-base font-semibold" style={{ color: '#B983FF' }}>
              Ordenar por
            </button>
          )}
        </div>

        {/* Lista de lugares */}
        <div className="px-4">
          {loading && (
            <div className="text-center py-12">
              <div className="loading-spinner"></div>
              <p className="text-xl font-semibold text-white mt-4">Cargando...</p>
            </div>
          )}

          {error && (
            <div className="info-card" style={{ backgroundColor: 'rgba(139, 30, 63, 0.2)', borderColor: 'rgba(139, 30, 63, 0.4)' }}>
              <p className="font-semibold text-white text-base">{error}</p>
            </div>
          )}

          {!loading && !error && (!places || places.length === 0) && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📍</div>
              <p className="text-2xl font-black mb-4 text-white">
                No hay lugares guardados
              </p>
              <button
                onClick={() => navigate('/places/add')}
                className="big-button primary"
                style={{ maxWidth: '300px', margin: '0 auto' }}
              >
                Agregar mi primer lugar
              </button>
            </div>
          )}

          {!loading && !error && places && places.length > 0 && (
            <div className="pb-4 pt-4 space-y-5">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onView={(id) => navigate(`/places/${id}`)}
                  onEdit={(id) => navigate(`/places/${id}`)}
                  onDelete={(id) => setShowDeleteConfirm(id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modal de confirmación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="info-card max-w-sm w-full">
              <h3 className="text-2xl font-black mb-3 text-white">
                ¿Eliminar lugar?
              </h3>
              <p className="text-base mb-6 text-light">
                Esta acción no se puede deshacer
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={actionLoading}
                  className="big-button w-full"
                  style={{ background: 'linear-gradient(135deg, #DC2626, #991B1B)', color: 'white' }}
                >
                  {actionLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="big-button w-full"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};