"use client";

import { useEffect, useState } from "react";

interface GalleryFile {
  name: string;
  url: string;
  size: number;
  lastModified: string;
}

interface Props {
  onSelect: (url: string) => void;
  onClose: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageGalleryModal({ onSelect, onClose }: Props) {
  const [files, setFiles] = useState<GalleryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/uploads", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((json) => setFiles(json.files ?? []))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, []);

  // Chiudi con ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wide">
            Galleria immagini
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-primary transition-colors"
            aria-label="Chiudi galleria"
          >
            <span className="material-symbols-outlined text-[22px] leading-none">close</span>
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <p className="text-sm text-gray-400 text-center py-12">Caricamento…</p>
          )}
          {!loading && files.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-12">Nessuna immagine trovata.</p>
          )}
          {!loading && files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {files.map((f) => (
                <button
                  key={f.url}
                  type="button"
                  onClick={() => setSelected(f.url)}
                  onDoubleClick={() => onSelect(f.url)}
                  className={`group relative aspect-square overflow-hidden border-2 transition-all ${
                    selected === f.url
                      ? "border-primary shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.url}
                    alt={f.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {selected === f.url && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[28px] drop-shadow">
                        check_circle
                      </span>
                    </div>
                  )}
                  {/* Tooltip nome + dimensione */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white truncate leading-tight">{f.name}</p>
                    <p className="text-[10px] text-white/60">{formatSize(f.size)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            {selected
              ? `Selezionata: ${selected}`
              : "Clicca per selezionare, doppio click per usare"}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline text-sm px-5 py-2"
            >
              Annulla
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={() => selected && onSelect(selected)}
              className="btn-accent text-sm px-5 py-2 disabled:opacity-40"
            >
              Usa immagine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
