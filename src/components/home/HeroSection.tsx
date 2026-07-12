"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Software that earns its place",
    text: "Lattice helps teams discover focused tools without the noise of crowded directories.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5926c1c2c2c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "List once. Reach serious buyers.",
    text: "Publish clear pricing, specs, and proof so operators can decide with confidence.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "A calmer way to compare tools",
    text: "Consistent cards, honest filters, and detail pages built for evaluation—not hype.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  },
];

export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[66vh] min-h-[440px] w-full overflow-hidden bg-ink text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />
        </motion.div>
      </AnimatePresence>

      <div className="container-pad relative z-10 flex h-full flex-col justify-center pt-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-semibold sm:text-5xl"
        >
          Lattice
        </motion.p>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            className="mt-4 max-w-2xl"
          >
            <h1 className="text-2xl font-medium leading-tight sm:text-3xl md:text-[2.1rem]">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {slide.text}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/explore" className="btn btn-accent">
            Explore marketplace
          </Link>
          <Link
            href="/register"
            className="btn border border-white/25 bg-white/5 text-white hover:bg-white/10"
          >
            Create free account
          </Link>
        </div>

        <div className="mt-10 flex gap-2">
          {slides.map((_, dot) => (
            <button
              key={dot}
              type="button"
              aria-label={`Show slide ${dot + 1}`}
              onClick={() => setIndex(dot)}
              className={`h-2.5 rounded-full transition-all ${
                index === dot ? "w-8 bg-accent" : "w-2.5 bg-white/35"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
