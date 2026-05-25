interface OcchielloProps {
  label: string;
  className?: string;
}

export default function Occhiello({ label, className = "" }: OcchielloProps) {
  return (
    <span
      className={`inline-block border border-primary bg-accent-light px-2 py-1 text-xs font-bold uppercase tracking-widest text-primary ${className}`}
    >
      {label}
    </span>
  );
}
