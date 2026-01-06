import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { FavoritePlacesListScreen } from './features/places/screens/FavoritePlacesListScreen';
import { AddPlaceScreen } from './features/places/screens/AddPlaceScreen';
import { PlaceDetailScreen } from './features/places/screens/PlaceDetailScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/places" replace />} />
        
        <Route path="/places" element={<FavoritePlacesListScreen />} />
        <Route path="/places/add" element={<AddPlaceScreen />} />
        <Route path="/places/:id" element={<PlaceDetailScreen />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Página no encontrada</p>
        <a href="/places" className="big-button primary">
          Volver a Lugares
        </a>
      </div>
    </div>
  );
}

export default App;