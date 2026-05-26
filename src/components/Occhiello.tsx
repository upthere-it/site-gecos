interface OcchielloProps {
  label: string;
  className?: string;
}

export default function Occhiello({ label, className = "" }: OcchielloProps) {
  return (
    <span
        style={{
            border: "4px solid transparent",
            borderImageSource: "url('/assets/Vector-light.svg')",
            borderImageSlice: "12 fill",
            borderImageWidth: "12px",
            borderImageRepeat: "stretch",
        }}
      className={`max-w-fit inline-flex items-center bg-accent-light px-3 py-1.5 text-[11px] 
      md:text-xs font-bold uppercase tracking-[0.15em] text-primary leading-none h-[29px] md:h-[39px] ${className}`}
    >
      {label}
    </span>
  );
}
