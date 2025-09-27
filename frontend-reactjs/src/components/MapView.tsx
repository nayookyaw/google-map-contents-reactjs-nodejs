import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { getListLocationsApi } from "../api/http";
import { createLocationApi } from "../api/http";
import AddLocationModal from "../components/AddLocationModal";
import { DEFAULT_NO_IMAGE } from "../constants/ImgConst";

type LocationItem = {
  id: number; name: string; lat: number; lng: number;
  description?: string; createdAt: string;
  imageBase64?: string; imageMime?: string;
  locationName?: string; screenWidth?: number; screenHeight?: number;
};

const containerStyle: React.CSSProperties = { width: "100%", height: "100vh" };

export default function MapView(): JSX.Element {
  const [locations, setLocations] = React.useState<LocationItem[]>([]);
  const [selected, setSelected] = React.useState<LocationItem | null>(null);

  const [open, setOpen] = React.useState(false);
  const [clickedLat, setClickedLat] = React.useState<number | null>(null);
  const [clickedLng, setClickedLng] = React.useState<number | null>(null);

  React.useEffect(() => { getLocationList(); }, []);

  const getLocationList = () => {
    getListLocationsApi()
      .then((response: any) => setLocations(response?.data ?? []))
      .catch((err: any) => console.error("Failed to fetch locations", err));
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setClickedLat(e.latLng.lat());
    setClickedLng(e.latLng.lng());
    setOpen(true);
  };

  const handleCreateLocation = async (payload: any) => {
    try {
      const createdLocation : any = await createLocationApi(payload);
      setLocations(prev => [createdLocation?.data, ...prev]);
    } catch (err) {
      console.error("Failed to create user", err);
    }    
  };

  const center = locations.length > 0
    ? { lat: locations[0]?.lat, lng: locations[0]?.lng }
    : { lat: -36.8485, lng: 174.7622 };
    
  const dotIcons = {
    green:  "https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png",
    yellow: "https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png",
    red:    "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
    blue:   "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
    ltblue: "https://maps.gstatic.com/mapfiles/ms2/micons/ltblue-dot.png",
    purple: "https://maps.gstatic.com/mapfiles/ms2/micons/purple-dot.png",
    pink:   "https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png",
  };

  const greenDot: google.maps.Icon = {
    url: dotIcons?.red,
    scaledSize: new google.maps.Size(48, 48), // ⬅️ bigger (px)
    anchor: new google.maps.Point(24, 48),    // ⬅️ tip at bottom-center
  };

  return (
    <>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onClick={handleMapClick}>
        {locations.map((loc) => (
          <Marker key={loc.id} position={{ lat: loc.lat, lng: loc.lng }} onClick={() => setSelected(loc)} 
           icon={greenDot}
          />
        ))}

        {selected && (
          <InfoWindow position={{ lat: selected.lat, lng: selected.lng }} onCloseClick={() => setSelected(null)}>
            <div className="poi-card">
              <div className="poi-image-wrap">
                <img
                  className="poi-image"
                  src={
                    selected.imageBase64 && selected.imageMime
                      ? `data:${selected.imageMime};base64,${selected.imageBase64}`
                      : `${DEFAULT_NO_IMAGE}`
                  }
                  alt={selected.name}
                />
              </div>
              <div className="poi-body">
                <div className="poi-title">{selected.name}</div>
                {(selected.locationName || selected.description) && (
                  <div className="poi-line">
                    <span className="poi-icon" aria-hidden>📍</span>
                    {selected.locationName || selected.description}
                  </div>
                )}
                <div className="poi-line">
                  <span className="poi-icon" aria-hidden>💻</span>
                  {selected.screenWidth && selected.screenHeight
                    ? `${selected.screenWidth} × ${selected.screenHeight}px`
                    : "Size N/A"}
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <AddLocationModal
        open={open}
        onClose={() => setOpen(false)}
        lat={clickedLat}
        lng={clickedLng}
        onSubmit={handleCreateLocation}
      />
    </>
  );
}