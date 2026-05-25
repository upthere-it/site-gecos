import Image from "next/image";
import SectionTitle from "./SectionTitle";

interface PartnerProps {
  occhiello: string;
  title: string;
  subtitle: string;
}

const LOGOS = [
  { src: "/assets/logos/logo-anas.png", alt: "ANAS Gruppo FS Italiane", w: 160, h: 80 },
  { src: "/assets/logos/logo-comune-pomezia.png", alt: "Comune di Pomezia", w: 80, h: 80 },
  { src: "/assets/logos/logo-acea.png", alt: "ACEA S.p.A.", w: 160, h: 80 },
  { src: "/assets/logos/logo-comune-2.png", alt: "Comune", w: 80, h: 80 },
];

export default function Partner({ occhiello, title, subtitle }: PartnerProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container-boxed">
        <SectionTitle occhiello={occhiello} title={title} subtitle={subtitle} />
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-[100px] gap-y-10 md:flex-nowrap md:justify-between">
          {LOGOS.map((logo) => (
            <div key={logo.alt} className="flex items-center justify-center h-[80px]">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="object-contain h-[80px] w-auto max-w-[180px]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
