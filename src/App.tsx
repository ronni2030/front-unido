import { Routes, Route, Navigate } from 'react-router-dom';
import './Styles.css';

// Dashboard
import { Dashboard } from './features/dashboard/screens/DashboardScreen';

// Identificación
import { CardSetupScreen } from './features/identification-card/screens/CardSetupScreen';
import { CardViewScreen } from './features/identification-card/screens/CardViewScreen';
import { CardUpdateScreen } from './features/identification-card/screens/CardUpdateScreen';

// Navegación
import { DestinationScreen } from './features/navigation/screens/DestinationScreen';
import { LocationScreen } from './features/navigation/screens/LocationScreen';

// Historial
import { HistoryListScreen } from './features/navigation-history/screens/HistoryListScreen';

// Lugares
import { FavoritePlacesListScreen } from './features/places/screens/FavoritePlacesListScreen';
import { AddPlaceScreen } from './features/places/screens/AddPlaceScreen';
import { PlaceDetailScreen } from './features/places/screens/PlaceDetailScreen';

// Componentes de prueba
import { ConnectionTest as ConnectionTestScreen } from './components/ConnectionTest';

function App() {
  return (
    <Routes>
      {/* Dashboard principal */}
      <Route path="/" element={<Dashboard />} />
      
      {/* Rutas de identificación */}
      <Route path="/setup-card" element={<CardSetupScreen />} />
      <Route path="/view-card" element={<CardViewScreen />} />
      <Route path="/update-card" element={<CardUpdateScreen />} />
      
      {/* Rutas de navegación GPS */}
      <Route path="/location" element={<LocationScreen />} />
      <Route path="/new-route" element={<DestinationScreen />} />
      
      {/* Ruta de historial */}
      <Route path="/history-list" element={<HistoryListScreen />} />
      
      {/* Rutas de lugares favoritos */}
      <Route path="/places" element={<FavoritePlacesListScreen />} />
      <Route path="/places/add" element={<AddPlaceScreen />} />
      <Route path="/places/:id" element={<PlaceDetailScreen />} />
      
      {/* Ruta de prueba de conexión */}
      <Route path="/test-connection" element={<ConnectionTestScreen />} />
      
      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;