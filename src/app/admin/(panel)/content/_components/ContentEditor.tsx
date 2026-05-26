"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface Props {
  pageKey: string;
  initialData: unknown;
}

// camelCase / snake_case → "Camel Case"
function humanizeKey(key: string): string {
  if (/^\d+$/.test(key)) return `#${key}`;
  const withSpaces = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function isLongString(s: string): boolean {
  if (s.includes("\n")) return true;
  return s.length > 80;
}

// immutabilmente sostituisce un valore in una struttura nested usando un path
function setIn(obj: JsonValue, path: (string | number)[], value: JsonValue): JsonValue {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    const idx = Number(head);
    copy[idx] = setIn(copy[idx] as JsonValue, rest, value);
    return copy;
  }
  if (obj && typeof obj === "object") {
    const copy = { ...(obj as Record<string, JsonValue>) };
    copy[head as string] = setIn(copy[head as string], rest, value);
    return copy;
  }
  return value;
}

function removeAt(obj: JsonValue, path: (string | number)[]): JsonValue {
  if (path.length === 0) return obj;
  const last = path[path.length - 1];
  const parentPath = path.slice(0, -1);

  function recurse(o: JsonValue, p: (string | number)[]): JsonValue {
    if (p.length === 0) {
      if (Array.isArray(o)) {
        const copy = [...o];
        copy.splice(Number(last), 1);
        return copy;
      }
      if (o && typeof o === "object") {
        const copy = { ...(o as Record<string, JsonValue>) };
        delete copy[last as string];
        return copy;
      }
      return o;
    }
    const [head, ...rest] = p;
    if (Array.isArray(o)) {
      const copy = [...o];
      copy[Number(head)] = recurse(copy[Number(head)] as JsonValue, rest);
      return copy;
    }
    if (o && typeof o === "object") {
      const copy = { ...(o as Record<string, JsonValue>) };
      copy[head as string] = recurse(copy[head as string], rest);
      return copy;
    }
    return o;
  }
  return recurse(obj, parentPath);
}

function appendAt(obj: JsonValue, path: (string | number)[], item: JsonValue): JsonValue {
  function recurse(o: JsonValue, p: (string | number)[]): JsonValue {
    if (p.length === 0) {
      if (Array.isArray(o)) return [...o, item];
      return o;
    }
    const [head, ...rest] = p;
    if (Array.isArray(o)) {
      const copy = [...o];
      copy[Number(head)] = recurse(copy[Number(head)] as JsonValue, rest);
      return copy;
    }
    if (o && typeof o === "object") {
      const copy = { ...(o as Record<string, JsonValue>) };
      copy[head as string] = recurse(copy[head as string], rest);
      return copy;
    }
    return o;
  }
  return recurse(obj, path);
}

// crea un item "vuoto" dello stesso tipo del primo elemento dell'array
function emptyLike(sample: JsonValue): JsonValue {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") {
    const empty: Record<string, JsonValue> = {};
    for (const k of Object.keys(sample)) {
      empty[k] = emptyLike((sample as Record<string, JsonValue>)[k]);
    }
    return empty;
  }
  return "";
}

interface FieldProps {
  fieldKey: string;
  path: (string | number)[];
  value: JsonValue;
  onChange: (path: (string | number)[], value: JsonValue) => void;
  onRemove?: () => void;
  depth: number;
}

function Field({ fieldKey, path, value, onChange, onRemove, depth }: FieldProps) {
  const label = humanizeKey(fieldKey);

  // STRING
  if (typeof value === "string") {
    const useTextarea = isLongString(value);
    return (
      <div className="mb-4">
        <div className="flex items-baseline justify-between gap-2">
          <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
            {label}
          </label>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-error hover:underline"
            >
              rimuovi
            </button>
          )}
        </div>
        {useTextarea ? (
          <textarea
            value={value}
            rows={3}
            onChange={(e) => onChange(path, e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
          />
        )}
        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{fieldKey}</p>
      </div>
    );
  }

  // NUMBER
  if (typeof value === "number") {
    return (
      <div className="mb-4">
        <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
          {label}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(path, Number(e.target.value))}
          className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
        />
        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{fieldKey}</p>
      </div>
    );
  }

  // BOOLEAN
  if (typeof value === "boolean") {
    return (
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(path, e.target.checked)}
          id={path.join("-")}
        />
        <label
          htmlFor={path.join("-")}
          className="text-xs font-bold text-primary uppercase tracking-wide"
        >
          {label} <span className="font-mono text-gray-400 normal-case font-normal">({fieldKey})</span>
        </label>
      </div>
    );
  }

  // ARRAY
  if (Array.isArray(value)) {
    return (
      <ArrayField
        fieldKey={fieldKey}
        path={path}
        value={value}
        onChange={onChange}
        depth={depth}
      />
    );
  }

  // OBJECT
  if (value && typeof value === "object") {
    return (
      <ObjectField
        fieldKey={fieldKey}
        path={path}
        value={value as Record<string, JsonValue>}
        onChange={onChange}
        depth={depth}
      />
    );
  }

  // NULL / undefined → input vuoto come stringa
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">
        {label}
      </label>
      <input
        type="text"
        value=""
        onChange={(e) => onChange(path, e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
      />
      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{fieldKey} (null)</p>
    </div>
  );
}

interface ObjectFieldProps {
  fieldKey: string;
  path: (string | number)[];
  value: Record<string, JsonValue>;
  onChange: (path: (string | number)[], value: JsonValue) => void;
  depth: number;
}

function ObjectField({ fieldKey, path, value, onChange, depth }: ObjectFieldProps) {
  const label = humanizeKey(fieldKey);
  // top-level (depth 0) → render piatto senza container aggiuntivo
  if (depth === 0) {
    return (
      <>
        {Object.entries(value).map(([k, v]) => (
          <Field
            key={k}
            fieldKey={k}
            path={[...path, k]}
            value={v}
            onChange={onChange}
            depth={depth + 1}
          />
        ))}
      </>
    );
  }
  return (
    <fieldset
      className={`mb-4 bg-gray-50 border border-gray-200 p-4 ${
        depth > 1 ? "pl-4" : ""
      }`}
    >
      <legend className="text-xs font-bold text-gray-600 uppercase tracking-wide px-1">
        {label}{" "}
        <span className="font-mono text-gray-400 normal-case font-normal">
          ({fieldKey})
        </span>
      </legend>
      <div className="mt-2">
        {Object.entries(value).map(([k, v]) => (
          <Field
            key={k}
            fieldKey={k}
            path={[...path, k]}
            value={v}
            onChange={onChange}
            depth={depth + 1}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface ArrayFieldProps {
  fieldKey: string;
  path: (string | number)[];
  value: JsonValue[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
  depth: number;
}

function ArrayField({ fieldKey, path, value, onChange, depth }: ArrayFieldProps) {
  const label = humanizeKey(fieldKey);
  const allStrings = value.every((v) => typeof v === "string");
  const allObjects =
    value.length > 0 &&
    value.every((v) => v !== null && typeof v === "object" && !Array.isArray(v));

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  function add() {
    const sample =
      value.length > 0 ? emptyLike(value[0]) : ("" as JsonValue);
    onChange(path, [...value, sample] as JsonValue);
  }
  function removeIdx(i: number) {
    const copy = [...value];
    copy.splice(i, 1);
    onChange(path, copy);
    if (openIdx === i) setOpenIdx(null);
  }
  function updateIdx(i: number, v: JsonValue) {
    const copy = [...value];
    copy[i] = v;
    onChange(path, copy);
  }

  return (
    <fieldset className="mb-4 bg-gray-50 border border-gray-200 p-4">
      <legend className="text-xs font-bold text-gray-600 uppercase tracking-wide px-1">
        {label}{" "}
        <span className="font-mono text-gray-400 normal-case font-normal">
          ({fieldKey}) — {value.length} elementi
        </span>
      </legend>

      <div className="space-y-2 mt-2">
        {allStrings &&
          value.map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs text-gray-400 font-mono pt-2 w-6">{i + 1}.</span>
              {isLongString(item as string) ? (
                <textarea
                  value={item as string}
                  rows={2}
                  onChange={(e) => updateIdx(i, e.target.value)}
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={item as string}
                  onChange={(e) => updateIdx(i, e.target.value)}
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm text-primary focus:outline-none focus:border-primary"
                />
              )}
              <button
                type="button"
                onClick={() => removeIdx(i)}
                className="text-xs font-bold text-error border border-error px-2 py-1 hover:bg-error hover:text-white transition-colors"
                aria-label="Rimuovi elemento"
              >
                −
              </button>
            </div>
          ))}

        {allObjects &&
          value.map((item, i) => {
            const obj = item as Record<string, JsonValue>;
            const summary =
              (obj.question as string) ||
              (obj.title as string) ||
              (obj.name as string) ||
              (obj.label as string) ||
              `Elemento ${i + 1}`;
            const isOpen = openIdx === i;
            return (
              <div key={i} className="bg-white border border-gray-200">
                <div className="flex items-center justify-between px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="flex-1 text-left text-sm font-medium text-primary"
                  >
                    <span className="text-xs text-gray-400 font-mono mr-2">
                      {i + 1}.
                    </span>
                    {summary}
                    <span className="ml-2 text-xs text-gray-400">
                      {isOpen ? "▼" : "▶"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeIdx(i)}
                    className="text-xs font-bold text-error border border-error px-2 py-1 ml-2 hover:bg-error hover:text-white transition-colors"
                  >
                    −
                  </button>
                </div>
                {isOpen && (
                  <div className="px-3 pb-3 border-t border-gray-100">
                    <div className="mt-3">
                      {Object.entries(obj).map(([k, v]) => (
                        <Field
                          key={k}
                          fieldKey={k}
                          path={[...path, i, k]}
                          value={v}
                          onChange={onChange}
                          depth={depth + 2}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {!allStrings && !allObjects &&
          value.map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 p-2">
              <Field
                fieldKey={String(i)}
                path={[...path, i]}
                value={item}
                onChange={onChange}
                onRemove={() => removeIdx(i)}
                depth={depth + 1}
              />
            </div>
          ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 text-xs font-bold text-primary border border-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-colors"
      >
        + AGGIUNGI
      </button>
    </fieldset>
  );
}

export default function ContentEditor({ pageKey, initialData }: Props) {
  const router = useRouter();
  const [data, setData] = useState<JsonValue>(initialData as JsonValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(path: (string | number)[], value: JsonValue) {
    setData((prev) => setIn(prev, path, value));
    setSuccess(false);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${pageKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Errore durante il salvataggio");
      }
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  // Se il top-level è un oggetto rendiamo i suoi children direttamente
  // (in modo che non ci sia un fieldset esterno superfluo)
  const isTopObject =
    data !== null &&
    typeof data === "object" &&
    !Array.isArray(data);

  // Use removeAt and appendAt to keep linter happy and to expose them
  // (the array editor manipulates state via onChange, but we keep these
  // imported for potential future use).
  void removeAt;
  void appendAt;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white border border-gray-200 p-6">
        {isTopObject ? (
          <ObjectField
            fieldKey={pageKey}
            path={[]}
            value={data as Record<string, JsonValue>}
            onChange={handleChange}
            depth={0}
          />
        ) : (
          <Field
            fieldKey={pageKey}
            path={[]}
            value={data}
            onChange={handleChange}
            depth={0}
          />
        )}
      </div>

      {error && (
        <p className="text-sm text-error font-medium border border-error/30 bg-error/5 px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-success font-medium border border-success/30 bg-success/5 px-4 py-3">
          Salvato con successo!
        </p>
      )}

      <div className="flex items-center gap-3 sticky bottom-0 bg-white py-3 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="btn-accent disabled:opacity-50"
        >
          {loading ? "SALVATAGGIO…" : "SALVA MODIFICHE"}
        </button>
      </div>
    </form>
  );
}
