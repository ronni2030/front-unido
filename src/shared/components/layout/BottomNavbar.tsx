import { NavLink } from "react-router-dom";
import { FiHome, FiNavigation, FiMapPin, FiSettings } from "react-icons/fi";

export const BottomNavbar = () => {
  return (
    <nav className="bottom-navbar">
      <NavLink to="/" className="nav-item">
        <FiHome />
        <span>Inicio</span>
      </NavLink>

      <NavLink to="/guia" className="nav-item">
        <FiNavigation />
        <span>Guía</span>
      </NavLink>

      <NavLink to="/ubicacion" className="nav-item">
        <FiMapPin />
        <span>Ubicación</span>
      </NavLink>

      <NavLink to="/ajustes" className="nav-item">
        <FiSettings />
        <span>Ajustes</span>
      </NavLink>
    </nav>
  );
};
