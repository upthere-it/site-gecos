import Image from "next/image";
import Link from "next/link";

interface CardServiziProps {
  imageSrc: string;
  imageAlt: string;
  label: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  detail1Title: string;
  detail1Text: string;
  detail2Title?: string;
  detail2Text?: string;
  linkHref: string;
  linkText: string;
}

export default function CardServizi({
  imageSrc,
  imageAlt,
  label,
  title,
  titleAccent,
  subtitle,
  detail1Title,
  detail1Text,
  detail2Title,
  detail2Text,
  linkHref,
  linkText,
}: CardServiziProps) {
  return (
    <div className="flex flex-col">
      {/* Image card with overlay */}
      <div className="relative overflow-hidden aspect-[571/315]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 571px"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-7">
          <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {title}{" "}
            {titleAccent && (
              <span className="text-accent">{titleAccent}</span>
            )}
          </h3>
          <p className="mt-2 text-sm text-white/80">{subtitle}</p>
        </div>
      </div>

      {/* Detail panel */}
      <div className="bg-white p-7 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <p className="font-bold text-primary text-sm">{detail1Title}</p>
            <p className="text-sm text-primary/80 mt-1">{detail1Text}</p>
          </div>
          {detail2Title && detail2Text && (
            <div>
              <p className="font-bold text-primary text-sm">{detail2Title}</p>
              <p className="text-sm text-primary/80 mt-1">{detail2Text}</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link
            href={linkHref}
            className="text-sm font-medium text-primary underline hover:no-underline"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
