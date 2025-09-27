// MapView.tsx
import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { createLocation, getListLocationsApi } from "../api/http";

type LocationItem = {
  id: number; name: string; lat: number; lng: number;
  description?: string; createdAt: string;
};

const containerStyle: React.CSSProperties = { width: "100%", height: "100vh" };

export default function MapView(): JSX.Element {
  const [locations, setLocations] = React.useState<LocationItem[]>([]);
  const [selected, setSelected] = React.useState<LocationItem | null>(null);

  React.useEffect(() => { getLocationList(); }, []);

  const getLocationList = () => {
    getListLocationsApi()
      .then((response: any) => setLocations(response?.data ?? []))
      .catch((err: any) => console.error("Failed to fetch locations", err));
  };

  const handleMapClick = React.useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const name = window.prompt("Location name?");
    if (!name) return;
    const description = window.prompt("Description?") || undefined;

    try {
      const created = await createLocation({ name, lat, lng, description });
      // optimistic add (uncomment if your API returns the created record)
      // setLocations(prev => [created.data ?? created, ...prev]);
      // or refetch:
      getLocationList();
    } catch (err) {
      console.error("Failed to create location:", err);
    }
  }, []);

  const center = locations.length
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: -36.8485, lng: 174.7622 };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={handleMapClick}
    >
      {locations.map((loc) => (
        <Marker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} onClick={() => setSelected(loc)} />
      ))}

      {selected && (
        <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
          <div>
            <strong>{selected.name}</strong>
            <div>X: {selected.lat.toFixed(6)}</div>
            <div>Y: {selected.lng.toFixed(6)}</div>
            {selected.description && <div>{selected.description}</div>}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}