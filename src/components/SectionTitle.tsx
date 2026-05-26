import Occhiello from "./Occhiello";

interface SectionTitleProps {
  occhiello?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionTitle({
  occhiello,
  title,
  subtitle,
  centered = false,
  className = "",
}: SectionTitleProps) {
  const alignClass = centered ? "text-center" : "text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      {occhiello && <Occhiello label={occhiello} className="mb-4" />}
      <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-primary leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-primary-950 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
