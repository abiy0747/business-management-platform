"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";

const store = {
  name: "Your Mobile Store",
  address: "Bahir Dar, Ethiopia",
  phone: "+251 9XX XXX XXXX",
  whatsapp: "+251 9XX XXX XXXX",
  hours: "Every day • 8:00 AM – 8:00 PM",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white pb-24 text-[#222022]">
      <div className="relative mx-auto max-w-md">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-[#C3D809]/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 top-[500px] h-64 w-64 rounded-full bg-black/[0.04] blur-3xl" />

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-3 px-5 pb-4 pt-6"
        >
          <Link
            href="/catalog"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-[#C3D809] hover:bg-[#C3D809] active:scale-90"
            aria-label="Back to catalog"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </Link>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
              Store Information
            </p>

            <h1 className="text-xl font-black tracking-tight">
              About Us
            </h1>
          </div>
        </motion.header>

        {/* Hero */}
        <section className="relative px-5 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative overflow-hidden rounded-[30px] bg-[#222022] px-6 py-8 text-white shadow-[0_20px_60px_rgba(34,32,34,0.15)]"
          >
            {/* Animated glow */}
            <motion.div
              animate={{
                x: [0, 25, 0],
                y: [0, -15, 0],
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C3D809]/20 blur-3xl"
            />

            {/* Rotating circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear",
              }}
              className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full border border-[#C3D809]/20"
            />

            <div className="relative z-10">
              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.08,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C3D809] text-[#222022] shadow-[0_10px_30px_rgba(195,216,9,0.2)]"
              >
                <Smartphone size={22} />
              </motion.div>

              <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                Welcome to
              </p>

              <h2 className="mt-2 text-[32px] font-black leading-[1.05] tracking-tight">
                {store.name}
              </h2>

              <p className="mt-4 max-w-[290px] text-sm leading-6 text-white/55">
                Your destination for quality mobile accessories,
                useful everyday tech, and products made to keep
                you connected.
              </p>

              {/* Status badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-0 right-0 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C3D809]" />

                <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Open today
                </span>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Contact heading */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="px-5 pt-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
            Contact & Location
          </p>

          <h2 className="mt-2 text-[25px] font-black leading-tight tracking-tight">
            Find us.
            <br />
            Talk to us.
          </h2>
        </motion.section>

        {/* Contact cards */}
        <section className="space-y-3 px-5 pt-6">
          {/* Address */}
          <motion.a
            href="https://www.google.com/maps/search/?api=1&query=Bahir+Dar+Ethiopia"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group flex items-center gap-4 rounded-[24px] border border-black/10 bg-[#f8f8f6] p-5 transition-all duration-300 hover:border-[#C3D809]/50 hover:bg-white hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover:bg-[#C3D809]">
              <MapPin size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                Visit us
              </p>

              <h3 className="mt-1 text-sm font-black">
                {store.address}
              </h3>
            </div>

            <ArrowUpRight
              size={17}
              className="text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
            />
          </motion.a>

          {/* Phone */}
          <motion.a
            href={`tel:${store.phone.replace(/\s/g, "")}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group flex items-center gap-4 rounded-[24px] border border-black/10 bg-[#f8f8f6] p-5 transition-all duration-300 hover:border-[#C3D809]/50 hover:bg-white hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover:bg-[#C3D809]">
              <Phone size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                Call us
              </p>

              <h3 className="mt-1 text-sm font-black">
                {store.phone}
              </h3>
            </div>

            <ArrowUpRight
              size={17}
              className="text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group flex items-center gap-4 rounded-[24px] border border-black/10 bg-[#f8f8f6] p-5 transition-all duration-300 hover:border-[#C3D809]/50 hover:bg-white hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover:bg-[#C3D809]">
              <MessageCircle size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                WhatsApp
              </p>

              <h3 className="mt-1 text-sm font-black">
                Chat with us
              </h3>
            </div>

            <ArrowUpRight
              size={17}
              className="text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </motion.a>

          {/* Opening hours */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="group flex items-center gap-4 rounded-[24px] border border-black/10 bg-[#f8f8f6] p-5 transition-all duration-300 hover:border-[#C3D809]/50 hover:bg-white hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover:bg-[#C3D809]">
              <Clock3 size={19} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                Opening hours
              </p>

              <h3 className="mt-1 text-sm font-black">
                {store.hours}
              </h3>
            </div>
          </motion.div>
        </section>

        {/* Social media */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-5 pt-10"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
            Follow Us
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Instagram */}
            <motion.a
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              href="#"
              className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f8f8f6] p-4 transition-all hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-[18px] w-[18px] items-center justify-center rounded-md bg-[#222022] text-[8px] font-black text-white">
                IG
              </div>

              <span className="text-xs font-bold">
                Instagram
              </span>

              <ArrowUpRight
                size={14}
                className="ml-auto opacity-30 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </motion.a>

         {/* Telegram */}
<motion.a
  whileHover={{ y: -4 }}
  whileTap={{ scale: 0.96 }}
  href="#"
  target="_blank"
  rel="noopener noreferrer"
  className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f8f8f6] p-4 transition-all hover:bg-white hover:shadow-lg"
>
  <div className="flex h-[18px] w-[18px] items-center justify-center rounded-md bg-[#222022] text-[8px] font-black text-white">
    TG
  </div>

  <span className="text-xs font-bold">
    Telegram
  </span>

  <ArrowUpRight
    size={14}
    className="ml-auto opacity-30 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
  />
</motion.a>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-5 pb-8 pt-10"
        >
          <Link href="/catalog">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-[24px] bg-[#C3D809] px-6 py-5 shadow-[0_15px_40px_rgba(195,216,9,0.15)]"
            >
              {/* Animated shine */}
              <motion.div
                animate={{
                  x: ["-120%", "120%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute inset-y-0 w-20 skew-x-[-20deg] bg-white/20 blur-md"
              />

              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#222022]/50">
                    Ready to shop?
                  </p>

                  <h3 className="mt-1 text-lg font-black">
                    Explore our accessories
                  </h3>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#222022] text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={19} />
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.section>
      </div>
    </main>
  );
}