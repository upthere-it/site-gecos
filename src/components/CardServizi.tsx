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

/**
 * Card servizio (used both in home and /servizi list).
 * Layout matches Figma node 249:5659:
 * - Image block 571x315 with primary/60 overlay, title (last word in accent) + sub at bottom
 * - Detail panel: gray-50 background, 2 stacked detail blocks, link at bottom
 */
export default function CardServizi({
  imageSrc,
  imageAlt,
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
  // If no explicit titleAccent prop, split last word of title to render in accent color
  const renderTitle = () => {
    if (titleAccent) {
      return (
        <>
          {title} <span className="text-accent">{titleAccent}</span>
        </>
      );
    }
    const words = title.trim().split(" ");
    if (words.length < 2) return title;
    const last = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-accent">{last}</span>
      </>
    );
  };

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
        <div className="absolute inset-0 flex flex-col justify-end p-[30px]">
          <h3 className="text-[28px] md:text-[32px] font-bold text-white leading-[1.15]">
            {renderTitle()}
          </h3>
          <p className="mt-3 text-[15px] text-white/80 leading-snug max-w-[440px]">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Detail panel */}
      <div className="bg-[#F5F5F5] p-[30px] flex-1 flex flex-col">
        <div className="space-y-6 flex-1">
          <div>
            <p className="font-bold text-primary text-[15px]">{detail1Title}</p>
            <p className="text-[14px] text-primary/80 mt-2 leading-relaxed">
              {detail1Text}
            </p>
          </div>
          {detail2Title && detail2Text && (
            <div>
              <p className="font-bold text-primary text-[15px]">{detail2Title}</p>
              <p className="text-[14px] text-primary/80 mt-2 leading-relaxed">
                {detail2Text}
              </p>
            </div>
          )}
        </div>
        <div className="mt-8">
          <Link
            href={linkHref}
            className="text-[14px] font-bold text-primary underline underline-offset-4 hover:no-underline"
          >
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
}
