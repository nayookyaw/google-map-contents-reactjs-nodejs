import React from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { getListLocationsApi } from "../api/http";
import { createLocationApi } from "../api/http";
import AddLocationModal from "../components/AddLocationModal";
import { DEFAULT_NO_IMAGE } from "../constants/ImgConst";
import { SlScreenTablet } from "react-icons/sl";
import { CgUnavailable } from "react-icons/cg";
import { FaCheckCircle } from "react-icons/fa";
import { RiSignalWifiOffLine } from "react-icons/ri";
import { FaBullhorn } from "react-icons/fa";

type LocationItem = {
  id: number; 
  name: string; 
  lat: number; 
  lng: number;
  description?: string; 
  createdAt: string;
  imageBase64?: string; 
  imageMime?: string;
  locationName?: string; 
  screenWidth?: number; 
  screenHeight?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
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

  // 2) Poll every 3 seconds (and fetch immediately on mount)
  React.useEffect(() => {
    // only poll when the tab is visible (avoids useless background work)
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        getLocationList();
      }
    }, 3000);

    return () => window.clearInterval(id); // cleanup on unmount
  }, []);

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

  // const center = locations.length > 0
  //   ? { lat: locations[0]?.lat, lng: locations[0]?.lng }
  //   : { lat: -36.8485, lng: 174.7622 };
  const DEFAULT_CENTER = { lat: -36.8485, lng: 174.7622 }; // Auckland, NZ
  const center = React.useMemo(() => {
  return locations.length
      ? { lat: locations[0].lat, lng: locations[0].lng }
      : DEFAULT_CENTER;
  }, [locations[0]?.lat, locations[0]?.lng]);
    
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

  const markerIcons = React.useMemo(() => { // NEW
    const make = (url: string): google.maps.Icon | string =>
      (typeof google !== "undefined" && google?.maps)
        ? {
            url,
            scaledSize: new google.maps.Size(48, 48), // bigger (px)
            anchor: new google.maps.Point(24, 48),    // tip at bottom-center
          }
        : url;
    return {
      green: make(dotIcons.green),
      yellow: make(dotIcons.yellow),
      red: make(dotIcons.red),
    };
  }, []);

  const isAlreadyAvailable = (loc: LocationItem) => { // NEW
    if (loc.isActive === false) return false;
    const endTs = loc.endDate ? new Date(loc.endDate).getTime() : NaN;
    const isExpired = Number.isFinite(endTs) && endTs < Date.now();
    if (isExpired) return true; // expired means already end of the ads period, so another person can use it
    return false;
  };

  const iconFor = (loc: LocationItem) => { // NEW
    // Priority: disabled (yellow) > expired (red) > valid (green)
    if (loc.isActive === false) return markerIcons.yellow;
    if (isAlreadyAvailable(loc)) return markerIcons.green; // expired means already end of the ads period, so another person can use it
    return markerIcons.red;
  };

  const showStatusAvailiability = (loc: LocationItem) => { // NEW
    if (loc.isActive === false) return (
      <>
      <span className="poi-icon" aria-hidden><RiSignalWifiOffLine /></span>
        Not active now, please check back later on.
      </>
    );
    if (isAlreadyAvailable(loc)) return (
      <>
      <span className="poi-icon" aria-hidden><FaCheckCircle color="green"/></span>
        Available, please grab it now!
        <button className="flex items-center gap-2 px-5 py-2.5 
          bg-gradient-to-r from-blue-500 to-indigo-600 
          hover:from-blue-600 hover:to-indigo-700
          text-white font-medium text-sm rounded-xl 
          shadow-md hover:shadow-lg transition-all duration-300">
          Advertise Now <FaBullhorn />
        </button>
      </>
    );

    return (
      <>
      <span className="poi-icon" aria-hidden><CgUnavailable /></span>
        Not available right now, somebody took already. Please check back later on.
      </>
    );
  };

  return (
    <>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onClick={handleMapClick}>
        {locations?.map((loc) => (
          <Marker key={loc.id} position={{ lat: loc?.lat, lng: loc?.lng }} onClick={() => setSelected(loc)} 
           icon={iconFor(loc)}
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
                  <span className="poi-icon" aria-hidden><SlScreenTablet /></span>
                  {selected.screenWidth && selected.screenHeight
                    ? `${selected.screenWidth} × ${selected.screenHeight}px`
                    : "Size N/A"}
                </div>
                <div className="poi-line">
                  {showStatusAvailiability(selected)}
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