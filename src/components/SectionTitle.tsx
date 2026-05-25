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
      {occhiello && (
        <Occhiello label={occhiello} className="mb-4" />
      )}
      <h2 className="text-3xl font-bold text-primary md:text-4xl lg:text-[2.3rem] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-primary/80 md:text-lg max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
