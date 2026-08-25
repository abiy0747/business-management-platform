"use client";

import Link from "next/link";
import {
  Heart,
  Home,
  Info,
  LayoutGrid,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Home",
    href: "/catalog",
    icon: Home,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: LayoutGrid,
  },
  {
    label: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    label: "About",
    href: "/about",
    icon: Info,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-black/10 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-3 backdrop-blur-xl">
      <div className="grid grid-cols-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            (item.href === "/catalog" && pathname === "/catalog");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex flex-col items-center gap-1 text-[10px] font-semibold transition-all duration-200 ${
                active
                  ? "text-[#222022]"
                  : "text-black/40"
              }`}
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                  active
                    ? "bg-[#C3D809]"
                    : "group-hover:bg-black/5"
                }`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </span>

              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}