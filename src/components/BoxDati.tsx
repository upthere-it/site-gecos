interface StatItem {
  value: string;
  label: string;
  variant?: "dark" | "light";
}

interface BoxDatiProps {
  stats: [StatItem, StatItem, StatItem];
}

export default function BoxDati({ stats }: BoxDatiProps) {
  const bgMap = {
    dark: "bg-primary",
    light: "bg-accent-light",
  };
  const valColorMap = {
    dark: "text-accent",
    light: "text-primary",
  };
  const labelColorMap = {
    dark: "text-accent",
    light: "text-primary",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => {
        const variant: "dark" | "light" = i === 1 ? "light" : "dark";
        return (
          <div
            key={i}
            className={`${bgMap[variant]} flex flex-col items-center justify-center py-10 px-6 min-h-[130px]`}
          >
            <span
              className={`text-5xl md:text-[56px] font-bold leading-none ${valColorMap[variant]}`}
            >
              {stat.value}
            </span>
            <span
              className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mt-3 ${labelColorMap[variant]}`}
            >
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
