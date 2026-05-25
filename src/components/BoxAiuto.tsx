import Link from "next/link";

interface BoxAiutoProps {
  title: string;
  subtitle: string;
  cta: string;
  phone?: string;
}

export default function BoxAiuto({
  title,
  subtitle,
  cta,
  phone = "069107142",
}: BoxAiutoProps) {
  return (
    <section className="bg-accent py-16 px-4">
      <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-[36px] font-bold text-white leading-tight">
          {title}
        </h2>
        <p className="text-base md:text-[17px] text-white/95 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
        <Link
          href={`tel:${phone}`}
          className="btn-outline-white mt-2 px-8 py-4"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}
