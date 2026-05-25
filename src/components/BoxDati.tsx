interface StatItem {
  value: string;
  label: string;
  variant: "dark" | "light" | "dark";
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
    dark: "text-accent/80",
    light: "text-primary/70",
  };

  return (
    <div className="grid grid-cols-3">
      {stats.map((stat, i) => {
        const variant = i === 1 ? "light" : "dark";
        return (
          <div
            key={i}
            className={`${bgMap[variant]} flex flex-col items-center justify-center py-8 px-4 border border-primary/20`}
          >
            <span
              className={`text-4xl md:text-5xl font-bold ${valColorMap[variant]}`}
            >
              {stat.value}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-widest mt-2 ${labelColorMap[variant]}`}
            >
              {stat.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
