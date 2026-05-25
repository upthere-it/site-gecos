"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LOGOS = [
  { src: "/assets/logos/logo-anas.png", alt: "ANAS", w: 100, h: 40 },
  { src: "/assets/logos/logo-comune-pomezia.png", alt: "Comune di Pomezia", w: 50, h: 40 },
  { src: "/assets/logos/logo-acea.png", alt: "ACEA", w: 80, h: 40 },
  { src: "/assets/logos/logo-comune-2.png", alt: "Comune", w: 50, h: 40 },
];

const DOUBLED = [...LOGOS, ...LOGOS, ...LOGOS];

export default function LoghiCarousel() {
  return (
    <section className="py-8 border-y border-gray-100 overflow-hidden">
      <div className="relative flex">
        <motion.div
          className="flex items-center gap-16 flex-shrink-0"
          animate={{ x: [0, -400 * LOGOS.length] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {DOUBLED.map((logo, i) => (
            <div key={i} className="flex-shrink-0">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="object-contain h-[30px] w-auto"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
