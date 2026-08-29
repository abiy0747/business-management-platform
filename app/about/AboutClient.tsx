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
import type { StoreData } from "@/lib/catalog-data";

type AboutClientProps = {
  store: StoreData | null;
  slug?: string;
};

export default function AboutClient({
  store,
  slug,
}: AboutClientProps) {
  const homeHref = slug
    ? `/store/${slug}`
    : "/catalog";
  const name = store?.name || "Our Store";
  const address = store?.address || null;
  const phone = store?.phone || null;
  const telegram = store?.telegram || null;
  const instagram = store?.instagram || null;
  const openingHours = store?.openingHours || null;
  const description =
    store?.description ||
    "Quality mobile accessories and useful everyday tech.";
  const aboutImageUrl = store?.aboutImageUrl || "/images/pp.jpg";

  const location = address ? address.split(",")[0] : null;
  const mapsLink = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`
    : undefined;
  const telLink = phone ? `tel:${phone.replace(/\s/g, "")}` : undefined;
  const telegramLink = telegram
    ? `https://t.me/${telegram.replace(/^@/, "")}`
    : undefined;
  const instagramLink = instagram
    ? `https://instagram.com/${instagram.replace(/^@/, "")}`
    : undefined;

  return (
    <main className="min-h-screen overflow-hidden bg-white pb-24 text-[#222022]">
      <div className="relative mx-auto max-w-md">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full bg-[#C3D809]/20 blur-3xl" />

        <div className="pointer-events-none absolute -left-24 top-[500px] h-64 w-64 rounded-full bg-black/[0.04] blur-3xl" />

        {/* ========================================================= */}
        {/* HEADER */}
        {/* ========================================================= */}

        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-30 flex items-center gap-3 px-5 pb-4 pt-6"
        >
          <Link
            href={homeHref}
            aria-label="Back to catalog"
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/80 backdrop-blur-xl transition-all duration-300 hover:-translate-x-1 hover:border-[#C3D809] hover:bg-[#C3D809] active:scale-90"
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

        {/* ========================================================= */}
        {/* LUXURY HERO */}
        {/* ========================================================= */}

        <section className="relative px-5 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative h-[330px] overflow-hidden rounded-[30px] bg-[#222022] shadow-[0_25px_70px_rgba(34,32,34,0.18)]"
          >
            {/* ======================================================= */}
            {/* LEFT SIDE — CONTENT */}
            {/* ======================================================= */}

            <div className="absolute inset-y-0 left-0 z-20 flex w-[62%] flex-col justify-center px-5">
              {/* Animated glow */}
              <motion.div
                animate={{
                  x: [0, 10, 0],
                  y: [0, -8, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[#C3D809]/15 blur-3xl"
              />

              {/* Icon */}
              <motion.div
                whileHover={{
                  rotate: 8,
                  scale: 1.08,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3D809] text-[#222022] shadow-[0_10px_30px_rgba(195,216,9,0.25)]"
              >
                <Smartphone size={20} />
              </motion.div>

              <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                Welcome to
              </p>

              <h2 className="mt-2 text-[23px] font-black leading-[1.05] tracking-tight text-white">
                {name}
              </h2>

              <p className="mt-3 text-[11px] leading-5 text-white/50">
                {description}
              </p>

              {/* Status */}
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C3D809]" />

                <span className="text-[8px] font-bold uppercase tracking-wider text-white/60">
                  Open today
                </span>
              </motion.div>
            </div>

            {/* ======================================================= */}
            {/* RIGHT SIDE — IMAGE */}
            {/* ======================================================= */}

            <div className="absolute inset-y-0 right-0 z-0 w-[60%] overflow-hidden">
              <img
                src={aboutImageUrl}
                alt={name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Premium image overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-[#222022]/50" />

              {/* Image shine */}
              <motion.div
                animate={{
                  x: ["-120%", "120%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute inset-y-0 w-16 skew-x-[-20deg] bg-white/10 blur-md"
              />
            </div>

            {/* ======================================================= */}
            {/* SMOOTH CURVED SEPARATION */}
            {/* ======================================================= */}

            <div className="pointer-events-none absolute inset-y-0 left-[38%] z-10 w-[30%]">
              <svg
                viewBox="0 0 160 330"
                preserveAspectRatio="none"
                className="h-full w-full"
              >
                <path
                  d="
                    M 0 0
                    C 72 18, 108 65, 82 105
                    C 55 145, 48 178, 82 215
                    C 116 252, 105 298, 0 330
                    L 0 330
                    Z
                  "
                  fill="#222022"
                />
              </svg>
            </div>

            {/* ======================================================= */}
            {/* SOFT CURVE EDGE */}
            {/* ======================================================= */}

            <div className="pointer-events-none absolute inset-y-0 left-[52%] z-20 w-3 opacity-20 blur-md">
              <div className="h-full w-full rounded-full bg-black/30" />
            </div>

            {/* ======================================================= */}
            {/* LOCATION BADGE */}
            {/* ======================================================= */}

            {location && (
              <div className="absolute bottom-4 left-4 z-30">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.15em] text-white/60 backdrop-blur-md">
                  {location}
                </span>
              </div>
            )}
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* CONTACT HEADING */}
        {/* ========================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
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

        {/* ========================================================= */}
        {/* CONTACT CARDS */}
        {/* ========================================================= */}

        <section className="space-y-3 px-5 pt-6">
          {/* ======================================================= */}
          {/* ADDRESS */}
          {/* ======================================================= */}

          {address && (
            <motion.a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
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
                  {address}
                </h3>
              </div>

              <ArrowUpRight
                size={17}
                className="text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
              />
            </motion.a>
          )}

          {/* ======================================================= */}
          {/* PHONE */}
          {/* ======================================================= */}

          {phone && (
            <motion.a
              href={telLink}
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
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
                  {phone}
                </h3>
              </div>

              <ArrowUpRight
                size={17}
                className="text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </motion.a>
          )}

          {/* ======================================================= */}
          {/* TELEGRAM */}
          {/* ======================================================= */}

          {telegram && (
            <motion.a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
              className="group flex items-center gap-4 rounded-[24px] border border-black/10 bg-[#f8f8f6] p-5 transition-all duration-300 hover:border-[#C3D809]/50 hover:bg-white hover:shadow-[0_15px_40px_rgba(34,32,34,0.08)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-300 group-hover:bg-[#C3D809]">
                <MessageCircle size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/35">
                  Telegram
                </p>

                <h3 className="mt-1 text-sm font-black">
                  Chat with us
                </h3>

                <p className="mt-0.5 text-[10px] text-black/40">
                  {telegram}
                </p>
              </div>

              <ArrowUpRight
                size={17}
                className="text-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </motion.a>
          )}

          {/* ======================================================= */}
          {/* OPENING HOURS */}
          {/* ======================================================= */}

          {openingHours && (
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
              whileHover={{
                y: -4,
                scale: 1.01,
              }}
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
                  {openingHours}
                </h3>
              </div>
            </motion.div>
          )}
        </section>

        {/* ========================================================= */}
        {/* SOCIAL MEDIA */}
        {/* ========================================================= */}

        {(instagram || telegram) && (
          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="px-5 pt-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
              Follow Us
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* ===================================================== */}
              {/* INSTAGRAM */}
              {/* ===================================================== */}

              {instagram && (
                <motion.a
                  whileHover={{
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f8f8f6] p-4 transition-all hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-[#222022] text-[8px] font-black text-white">
                    IG
                  </div>

                  <div className="min-w-0">
                    <span className="block text-xs font-bold">
                      Instagram
                    </span>

                    <span className="block text-[10px] text-black/40">
                      {instagram}
                    </span>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="ml-auto shrink-0 opacity-30 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </motion.a>
              )}

              {/* ===================================================== */}
              {/* TELEGRAM */}
              {/* ===================================================== */}

              {telegram && (
                <motion.a
                  whileHover={{
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f8f8f6] p-4 transition-all hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-[#222022] text-[8px] font-black text-white">
                    TG
                  </div>

                  <div className="min-w-0">
                    <span className="block text-xs font-bold">
                      Telegram
                    </span>

                    <span className="block text-[10px] text-black/40">
                      {telegram}
                    </span>
                  </div>

                  <ArrowUpRight
                    size={14}
                    className="ml-auto shrink-0 opacity-30 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </motion.a>
              )}
            </div>
          </motion.section>
        )}

        {/* ========================================================= */}
        {/* CTA */}
        {/* ========================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="px-5 pb-8 pt-10"
        >
          <Link href={homeHref}>
            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="group relative overflow-hidden rounded-[24px] bg-[#C3D809] px-6 py-5 shadow-[0_15px_40px_rgba(195,216,9,0.15)]"
            >
              {/* Shine */}
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