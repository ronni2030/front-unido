import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MapPreview } from "./MapPreview";

type Props = {
  direccion: string;
  fecha: string;
  onDelete: () => void;
  onEdit: () => void;
};

export const TrackingCard = ({
  direccion,
  fecha,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <div className="tracking-card">
      <div className="tracking-info">
        <p className="tracking-address">{direccion}</p>
        <span className="tracking-date">{fecha}</span>
      </div>

      <MapPreview address={direccion} />

      <div className="card-actions">
        <button className="btn-edit" onClick={onEdit}>
          <FiEdit2 size={18} />
          Editar
        </button>

        <button className="btn-delete" onClick={onDelete}>
          <FiTrash2 size={18} />
          Eliminar
        </button>
      </div>
    </div>
  );
};
