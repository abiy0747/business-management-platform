import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="relative mt-5 min-h-[185px] overflow-hidden rounded-[28px] bg-[#C3D809] p-6">
      <div className="relative z-10 max-w-[58%]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#222022]/60">
          New Collection
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-[#222022]">
          Upgrade Your
          <br />
          Everyday
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-[#222022]/65">
          Premium accessories for your everyday tech.
        </p>

        <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#222022] px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:gap-3 active:scale-95">
          Shop now
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="absolute -right-8 -bottom-12 h-44 w-44 rounded-full border-[18px] border-white/20" />

      <div className="absolute -right-5 top-5 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
    </section>
  );
}