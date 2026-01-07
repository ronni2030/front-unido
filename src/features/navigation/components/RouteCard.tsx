interface Props {
  index: number;
  direccion: string;
  fecha: string;
  onDelete: () => void;
  onEdit: () => void;
}

export const RouteCard = ({
  index,
  direccion,
  fecha,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <div className="route-card">
      <strong>
        Ruta {index + 1}
      </strong>

      <p>{direccion}</p>

      <span>{fecha}</span>

      <div className="route-actions">
        <button className="btn-delete" onClick={onDelete}>
          Eliminar
        </button>

        <button className="btn-secondary" onClick={onEdit}>
          Editar
        </button>
      </div>
    </div>
  );
};