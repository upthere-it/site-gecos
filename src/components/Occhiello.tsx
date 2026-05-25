interface OcchielloProps {
  label: string;
  className?: string;
}

export default function Occhiello({ label, className = "" }: OcchielloProps) {
  return (
    <span
      className={`inline-flex items-center border border-primary bg-accent-light px-3 py-1.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-primary leading-none h-[29px] md:h-[39px] ${className}`}
    >
      {label}
    </span>
  );
}
