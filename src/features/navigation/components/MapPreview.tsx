type MapPreviewProps = {
  address: string;
};

export const MapPreview = ({ address }: MapPreviewProps) => {
  if (!address) return null;

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    address
  )}&output=embed`;

  return (
    <div
      style={{
        width: "100%",
        height: 240,
        marginTop: 12,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <iframe
        title="Mapa de ubicación"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{
          border: 0,
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};