import React from 'react';
import { LocationItem } from '../api/http';

type Props = {
  open: boolean;
  onClose: () => void;
  initial: LocationItem;
  onSubmit: (payload: Partial<LocationItem>) => void;
};

export default function EditLocationModal({ open, onClose, initial, onSubmit }: Props) {
  const [name, setName] = React.useState(initial.name);
  const [description, setDescription] = React.useState(initial.description || '');
  const [locationName, setLocationName] = React.useState(initial.locationName || '');
  const [lat, setLat] = React.useState<number>(initial.lat);
  const [lng, setLng] = React.useState<number>(initial.lng);
  const [screenWidth, setScreenWidth] = React.useState<number | ''>(initial.screenWidth ?? '');
  const [screenHeight, setScreenHeight] = React.useState<number | ''>(initial.screenHeight ?? '');

  React.useEffect(() => {
    setName(initial.name);
    setDescription(initial.description || '');
    setLocationName(initial.locationName || '');
    setLat(initial.lat);
    setLng(initial.lng);
    setScreenWidth(initial.screenWidth ?? '');
    setScreenHeight(initial.screenHeight ?? '');
  }, [initial]);

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Location</h3>
        <div className="form-grid">
          <label>Name<input value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
          <label>Location Name<input value={locationName} onChange={e => setLocationName(e.target.value)} /></label>
          <label>Latitude<input type="number" step="0.000001" value={lat} onChange={e => setLat(parseFloat(e.target.value))} /></label>
          <label>Longitude<input type="number" step="0.000001" value={lng} onChange={e => setLng(parseFloat(e.target.value))} /></label>
          <label>Screen Width<input type="number" value={screenWidth} onChange={e => setScreenWidth(e.target.value === '' ? '' : parseFloat(e.target.value))} /></label>
          <label>Screen Height<input type="number" value={screenHeight} onChange={e => setScreenHeight(e.target.value === '' ? '' : parseFloat(e.target.value))} /></label>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onSubmit({
              name,
              description: description || undefined,
              locationName: locationName || undefined,
              lat, lng,
              screenWidth: typeof screenWidth === 'number' ? screenWidth : undefined,
              screenHeight: typeof screenHeight === 'number' ? screenHeight : undefined
            })}
          >Save</button>
        </div>
      </div>
    </div>
  );
}