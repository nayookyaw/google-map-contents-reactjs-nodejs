// components/AddLocationModal.tsx
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  lat: number | null;
  lng: number | null;
  onSubmit: (payload: {
    name: string;
    description?: string;
    locationName?: string;
    screenWidth?: number;
    screenHeight?: number;
    lat: number;
    lng: number;
    imageBase64?: string;
    imageMime?: string;
  }) => Promise<void> | void;
};

export default function AddLocationModal({ open, onClose, lat, lng, onSubmit }: Props) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [locationName, setLocationName] = React.useState("");
  const [screenWidth, setScreenWidth] = React.useState<number | "">("");
  const [screenHeight, setScreenHeight] = React.useState<number | "">("");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null); // data: url for preview
  const [errors, setErrors] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setName(""); setDescription(""); setLocationName("");
      setScreenWidth(""); setScreenHeight("");
      setImageFile(null); setImagePreview(null);
      setErrors([]); setSubmitting(false);
    }
  }, [open]);

  if (!open || lat == null || lng == null) return null;

  const onFileChange = async (f: File | null) => {
    setImageFile(f);
    if (!f) return setImagePreview(null);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(String(reader.result));
    reader.readAsDataURL(f);
  };

  const validate = () => {
    const e: string[] = [];
    if (!name.trim()) e.push("Name is required");
    setErrors(e);
    return e.length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      let imageBase64: string | undefined;
      let imageMime: string | undefined;

      if (imageFile) {
        const { base64, mime } = await fileToBase64(imageFile);
        imageBase64 = base64;
        imageMime = mime;
      }

      // if (imageFile) {
      //   const inputImg = await imageFileToBase64Compressed(imageFile, { maxW: 1024, maxH: 1024, quality: 0.8 });
      //   imageBase64 = inputImg.base64;
      //   imageMime = inputImg.mime;
      // }

      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        locationName: locationName.trim() || undefined,
        screenWidth: screenWidth === "" ? undefined : Number(screenWidth),
        screenHeight: screenHeight === "" ? undefined : Number(screenHeight),
        lat,
        lng,
        imageBase64,
        imageMime,
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  function fileToBase64(file: File): Promise<{ base64: string; mime: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => {
        const result = String(reader.result);
        const [prefix, b64] = result.split(",", 2);
        const mime = prefix.match(/data:(.*);base64/)?.[1] ?? "application/octet-stream";
        resolve({ base64: b64, mime });
      };
      reader.readAsDataURL(file);
    });
  }

  // async function imageFileToBase64Compressed(
  //   file: File,
  //   opts: { maxW?: number; maxH?: number; quality?: number } = {}
  // ): Promise<{ base64: string; mime: string }> {
  //   const maxW = opts.maxW ?? 1024;
  //   const maxH = opts.maxH ?? 1024;
  //   const quality = opts.quality ?? 0.8; // 0..1 (JPEG/WebP)

  //   const img = document.createElement("img");
  //   const url = URL.createObjectURL(file);
  //   await new Promise<void>((res, rej) => {
  //     img.onload = () => res();
  //     img.onerror = (e) => rej(e);
  //     img.src = url;
  //   });

  //   const { width, height } = img;
  //   let w = width, h = height;
  //   const ratio = Math.min(maxW / width, maxH / height, 1);
  //   w = Math.round(width * ratio);
  //   h = Math.round(height * ratio);

  //   const canvas = document.createElement("canvas");
  //   canvas.width = w;
  //   canvas.height = h;
  //   const ctx = canvas.getContext("2d")!;
  //   ctx.drawImage(img, 0, 0, w, h);

  //   // Prefer JPEG/WebP for compression
  //   const mime = file.type.includes("png") ? "image/jpeg" : (file.type || "image/jpeg");
  //   const dataUrl = canvas.toDataURL(mime, quality); // compress here
  //   URL.revokeObjectURL(url);

  //   const [prefix, b64] = dataUrl.split(",", 2);
  //   const outMime = prefix.match(/data:(.*);base64/)?.[1] ?? "image/jpeg";
  //   return { base64: b64, mime: outMime };
  // }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>Add Location</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {errors.length > 0 && <div className="alert">{errors.map((e,i)=><div key={i}>{e}</div>)}</div>}

          <label className="label">Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="The City Gateway" />

          <label className="label">Description</label>
          <input className="input" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Billboard description" />

          <label className="label">Location Name</label>
          <input className="input" value={locationName} onChange={e=>setLocationName(e.target.value)} placeholder="Brandor Lane" />

          <label className="label">Screen Width (px)</label>
          <input className="input" type="number" min={0} value={screenWidth} onChange={e=>setScreenWidth(e.target.value===""?"":Number(e.target.value))} placeholder="704" />

          <label className="label">Screen Height (px)</label>
          <input className="input" type="number" min={0} value={screenHeight} onChange={e=>setScreenHeight(e.target.value===""?"":Number(e.target.value))} placeholder="1408" />

          <label className="label">Image</label>
          <input className="input" type="file" accept="image/*" onChange={e=>onFileChange(e.target.files?.[0] ?? null)} />
          {imagePreview && <img src={imagePreview} alt="preview" style={{ marginTop: 8, width: "100%", borderRadius: 8 }} />}

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}