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
      <div className="flex flex-col items-center text-center gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
        <p className="text-base md:text-lg text-white/90 max-w-2xl">
          {subtitle}
        </p>
        <Link href={`tel:${phone}`} className="btn-outline-white px-8 py-4">
          {cta}
        </Link>
      </div>
    </section>
  );
}
