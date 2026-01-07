type Props = {
  vista: 'ajustes' | 'registro';
  onChange: (v: 'ajustes' | 'registro') => void;
};

function BottomNav({ vista, onChange }: Props) {
  return (
    <nav className="bottom-dock">
      <div
        className={`nav-btn ${vista === 'ajustes' ? 'active' : ''}`}
        onClick={() => onChange('ajustes')}
      >
        ⚙️
      </div>
      <div
        className={`nav-btn ${vista === 'registro' ? 'active' : ''}`}
        onClick={() => onChange('registro')}
      >
        📋
      </div>
    </nav>
  );
}

export default BottomNav;
