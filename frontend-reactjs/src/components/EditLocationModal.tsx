import React from 'react';
import { LocationItem } from '../api/http';

type Props = {
  open: boolean;
  onClose: () => void;
  initial: LocationItem;
  onSubmit: (payload: Partial<LocationItem>) => void;
};

const MAX_BYTES = 1 * 1024 * 1024; // 1 MB

export default function EditLocationModal({ open, onClose, initial, onSubmit }: Props) {
  const [name, setName] = React.useState(initial.name);
  const [description, setDescription] = React.useState(initial.description || '');
  const [locationName, setLocationName] = React.useState(initial.locationName || '');
  const [lat, setLat] = React.useState<number>(initial.lat);
  const [lng, setLng] = React.useState<number>(initial.lng);
  const [screenWidth, setScreenWidth] = React.useState<number | ''>(initial.screenWidth ?? '');
  const [screenHeight, setScreenHeight] = React.useState<number | ''>(initial.screenHeight ?? '');

  // Image handling
  const currentImgSrc = React.useMemo(() => {
    return initial.imageBase64 && initial.imageMime
      ? `data:${initial.imageMime};base64,${initial.imageBase64}`
      : '';
  }, [initial.imageBase64, initial.imageMime]);

  const [previewSrc, setPreviewSrc] = React.useState<string>(currentImgSrc);
  const [newImageBase64, setNewImageBase64] = React.useState<string | undefined>(undefined);
  const [newImageMime, setNewImageMime] = React.useState<string | undefined>(undefined);
  const [imageError, setImageError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setName(initial.name);
    setDescription(initial.description || '');
    setLocationName(initial.locationName || '');
    setLat(initial.lat);
    setLng(initial.lng);
    setScreenWidth(initial.screenWidth ?? '');
    setScreenHeight(initial.screenHeight ?? '');
    setPreviewSrc(currentImgSrc);
    setNewImageBase64(undefined);
    setNewImageMime(undefined);
    setImageError(null);
  }, [initial, currentImgSrc]);

  const onPickFile = async (file: File) => {
    setImageError(null);
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      setImageError('Only PNG or JPEG are allowed.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setImageError('Image too large. Max 1 MB.');
      return;
    }
    const arrBuf = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrBuf);
    // Convert to Base64 (without data: prefix)
    let binary = '';
    for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
    const b64 = btoa(binary);

    setNewImageBase64(b64);
    setNewImageMime(file.type);
    setPreviewSrc(URL.createObjectURL(file)); // fast preview
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal modal-wide">
        <h3>Edit Location</h3>

        <div className="two-col">
          <div className="col">
            <div className="form-grid">
              <label>Name<input value={name} onChange={e => setName(e.target.value)} /></label>
              <label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
              <label>Location Name<input value={locationName} onChange={e => setLocationName(e.target.value)} /></label>
              <label>Latitude<input type="number" step="0.000001" value={lat} onChange={e => setLat(parseFloat(e.target.value))} /></label>
              <label>Longitude<input type="number" step="0.000001" value={lng} onChange={e => setLng(parseFloat(e.target.value))} /></label>
              <label>Screen Width<input type="number" value={screenWidth} onChange={e => setScreenWidth(e.target.value === '' ? '' : parseFloat(e.target.value))} /></label>
              <label>Screen Height<input type="number" value={screenHeight} onChange={e => setScreenHeight(e.target.value === '' ? '' : parseFloat(e.target.value))} /></label>
            </div>
          </div>

          <div className="col">
            <div className="image-panel">
              <div className="image-header">
                <span>Image</span>
                <span className="muted">(PNG/JPEG, ≤ 1 MB)</span>
              </div>
              <div className="image-preview">
                {previewSrc ? (
                  <img src={previewSrc} alt="preview" />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>

              <label className="btn btn-outline file-btn">
                Choose Image
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPickFile(f);
                  }}
                  hidden
                />
              </label>
              {imageError && <div className="error mt8">{imageError}</div>}

              {newImageBase64 && (
                <div className="muted mt8">New image selected. It will replace the old image on Save.</div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => onSubmit({
              name,
              description: description || undefined,
              locationName: locationName || undefined,
              lat, lng,
              screenWidth: typeof screenWidth === 'number' ? screenWidth : undefined,
              screenHeight: typeof screenHeight === 'number' ? screenHeight : undefined,
              // Only send image fields if user picked a new image
              imageBase64: newImageBase64,
              imageMime: newImageMime as any
            })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}