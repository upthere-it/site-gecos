"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LOGOS = [
  { src: "/assets/logos/logo-anas.png", alt: "ANAS", w: 100, h: 30 },
  { src: "/assets/logos/logo-comune-pomezia.png", alt: "Comune di Pomezia", w: 50, h: 30 },
  { src: "/assets/logos/logo-acea.png", alt: "ACEA", w: 80, h: 30 },
  { src: "/assets/logos/logo-comune-2.png", alt: "Comune", w: 50, h: 30 },
];

const DOUBLED = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

export default function LoghiCarousel() {
  return (
    <section className="bg-primary-950 py-11 overflow-hidden">
      <div className="relative flex h-[30px] items-center">
        <motion.div
          className="flex items-center gap-[80px] flex-shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {DOUBLED.map((logo, i) => (
            <div key={i} className="flex-shrink-0 flex items-center h-[30px]">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="object-contain h-[30px] w-auto brightness-0 invert opacity-80"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
