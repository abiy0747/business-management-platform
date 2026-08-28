"use client";

import { ArrowRight } from "lucide-react";

type PromoBannerProps = {
  imageUrl: string | null;
  description: string | null;
};

export default function PromoBanner({
  imageUrl,
  description,
}: PromoBannerProps) {
  return (
    <section className="relative mt-5 min-h-[185px] overflow-hidden rounded-[28px] bg-[#222022] shadow-[0_15px_40px_rgba(34,32,34,0.10)]">

      {/* ========================================================= */}
      {/* LEFT CONTENT */}
      {/* ========================================================= */}

      <div className="relative z-20 w-[62%] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
          New Collection
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white">
          Upgrade Your
          <br />
          Everyday
        </h2>

        <p className="mt-2 max-w-[190px] text-xs leading-relaxed text-white/50">
          {description ||
            "Premium accessories for your everyday tech."}
        </p>

        {/* Shop Now */}
        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C3D809] px-4 py-2.5 text-xs font-bold text-[#222022] transition-all duration-300 hover:gap-3 hover:bg-[#d5ea18] active:scale-95">
          Shop now
          <ArrowRight size={14} />
        </button>
      </div>

      {/* ========================================================= */}
      {/* RIGHT IMAGE */}
      {/* ========================================================= */}

      <div className="absolute inset-y-0 right-0 z-0 w-[60%] overflow-hidden">
        <img
          src={imageUrl || "/images/store.jpg"}
          alt="Premium mobile accessories"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />

        {/* Very subtle image overlay */}
        <div className="absolute inset-0 bg-black/[0.04]" />
      </div>

      {/* ========================================================= */}
      {/* FULL CURVED SEPARATION */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-y-0 left-[38%] z-10 w-[30%]">
        <svg
          viewBox="0 0 160 185"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="
              M 0 0
              C 70 12, 105 35, 82 58
              C 58 82, 48 103, 82 125
              C 115 146, 105 170, 0 185
              L 0 185
              Z
            "
            fill="#222022"
          />
        </svg>
      </div>

      {/* ========================================================= */}
      {/* SOFT CURVE SHADOW */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-y-0 left-[51%] z-20 w-[12px] opacity-20 blur-md">
        <div className="h-full w-full rounded-full bg-black/30" />
      </div>

      {/* ========================================================= */}
      {/* DECORATIVE CIRCLE */}
      {/* ========================================================= */}

      <div className="absolute -bottom-12 -right-8 z-10 h-44 w-44 rounded-full border-[18px] border-white/20" />

      {/* ========================================================= */}
      {/* TOP GLOW */}
      {/* ========================================================= */}

      <div className="absolute -right-5 top-5 z-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />

      {/* ========================================================= */}
      {/* IMAGE LABEL */}
      {/* ========================================================= */}

      <div className="absolute bottom-4 right-4 z-30">
        <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white/75 backdrop-blur-md">
          Premium
        </span>
      </div>
    </section>
  );
}