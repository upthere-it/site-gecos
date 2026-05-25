import Image from "next/image";
import SectionTitle from "./SectionTitle";

interface PartnerProps {
  occhiello: string;
  title: string;
  subtitle: string;
}

const LOGOS = [
  { src: "/assets/logos/logo-anas.png", alt: "ANAS Gruppo FS Italiane", w: 120, h: 60 },
  { src: "/assets/logos/logo-comune-pomezia.png", alt: "Comune di Pomezia", w: 60, h: 60 },
  { src: "/assets/logos/logo-acea.png", alt: "ACEA S.p.A.", w: 100, h: 60 },
  { src: "/assets/logos/logo-comune-2.png", alt: "Comune", w: 60, h: 60 },
];

export default function Partner({ occhiello, title, subtitle }: PartnerProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container-boxed">
        <SectionTitle occhiello={occhiello} title={title} subtitle={subtitle} />
        <div className="mt-12 flex flex-wrap items-center justify-start gap-12 md:gap-16">
          {LOGOS.map((logo) => (
            <div key={logo.alt} className="flex items-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="object-contain h-[60px] w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
