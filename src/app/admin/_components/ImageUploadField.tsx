"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const ImageGalleryModal = dynamic(() => import("./ImageGalleryModal"), { ssr: false });

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const MAX_SIZE = 5 * 1024 * 1024;

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export default function ImageUploadField({ label, value, onChange, required }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  function validateFile(file: File): string | null {
    if (!ALLOWED_MIME.includes(file.type)) {
      return "Formato non supportato. Usa JPG, PNG, WebP o GIF.";
    }
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return "Estensione non consentita.";
    }
    if (file.size === 0) return "Il file è vuoto.";
    if (file.size > MAX_SIZE) return "File troppo grande. Massimo 5 MB.";
    return null;
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Anteprima locale (blob URL temporaneo)
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Errore durante il caricamento");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
    } finally {
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const previewSrc = localPreview ?? (value || null);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-primary uppercase tracking-wide">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      {/* Anteprima */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100 border border-gray-200">
        {previewSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Anteprima"
              className="w-full h-full object-cover"
            />
            {localPreview && (
              <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                Locale – non ancora salvata
              </span>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-medium">Caricamento…</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300">
            <span className="material-symbols-outlined text-[40px] leading-none">image</span>
            <span className="text-xs">Nessuna immagine</span>
          </div>
        )}
      </div>

      {/* Path testuale (modificabile manualmente) */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/assets/photos/immagine.jpg"
        className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary font-mono"
      />

      {/* Azioni */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wide hover:bg-primary-950 disabled:opacity-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] leading-none">upload</span>
          {uploading ? "Caricamento…" : "Carica immagine"}
        </button>
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="flex items-center gap-1.5 px-4 py-2 border border-primary text-primary text-xs font-bold uppercase tracking-wide hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] leading-none">photo_library</span>
          Sfoglia galleria
        </button>
      </div>

      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}

      {/* Input file nascosto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modale galleria */}
      {showGallery && (
        <ImageGalleryModal
          onSelect={(url) => {
            onChange(url);
            setShowGallery(false);
          }}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}
