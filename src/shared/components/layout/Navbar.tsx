import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, History, CreditCard } from 'lucide-react';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Main navigation items
    const finalNavItems = [
        { label: 'Inicio', icon: Home, path: '/' },
        { label: 'Ubicación', icon: MapPin, path: '/location' },
        { label: 'Historial', icon: History, path: '/history-list' },
        { label: 'Mi Tarjeta', icon: CreditCard, path: '/view-card' },
    ];

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="absolute bottom-0 left-0 right-0 z-50 bg-[#1B1026]/80 backdrop-blur-xl border-t border-white/10 px-6 pb-6 pt-3 flex justify-between items-center w-full">
            {finalNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-accent scale-110' : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        <item.icon size={24} strokeWidth={active ? 2.5 : 2} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'opacity-100' : 'opacity-0'}`}>
                            {item.label}
                        </span>
                        {active && (
                            <div className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_rgba(185,131,255,0.8)]"></div>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};
