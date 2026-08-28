
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  Bell,
  CircleDollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Tags,
  WalletCards,
  X,
} from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Purchases",
    href: "/admin/purchases",
    icon: ShoppingCart,
  },
  {
    label: "Sales",
    href: "/admin/sales",
    icon: Receipt,
  },
  {
    label: "Expenses",
    href: "/admin/expenses",
    icon: WalletCards,
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    label: "Store Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [businessName, setBusinessName] =
    useState("");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStoreInfo() {
      try {
        const response = await fetch(
          "/api/admin/settings",
          { cache: "no-store" }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (active) {
          setBusinessName(data.settings?.name || "");
          setAdminName(data.adminName || "");
        }
      } catch {
        // Ignore — keep fallback placeholders.
      }
    }

    loadStoreInfo();

    return () => {
      active = false;
    };
  }, []);

  const brandName = businessName || "Store";
  const profileName = adminName || "Admin";
  const profileInitial = profileName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F6F6F3] text-[#222022]">

      <div className="flex min-h-screen">

        {/* ==================================================
            DESKTOP SIDEBAR
        ================================================== */}

        <aside className="hidden w-[250px] shrink-0 border-r border-black/[0.06] bg-[#222022] text-white lg:flex lg:flex-col">

          {/* Brand */}

          <div className="px-7 pb-7 pt-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3D809] text-[#222022]">
                <CircleDollarSign size={21} />
              </div>

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">
                  Management
                </p>

                <h1 className="mt-0.5 text-lg font-black tracking-tight">
                  {brandName}
                </h1>

              </div>

            </div>

          </div>

          {/* Navigation */}

          <nav className="flex-1 px-4">

            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
              Workspace
            </p>

            <div className="space-y-1">

              {menuItems.map((item) => {

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
                  >

                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />

                    <span>
                      {item.label}
                    </span>

                  </Link>
                );

              })}

            </div>

          </nav>

          {/* Bottom */}

          <div className="border-t border-white/[0.06] p-4">

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-white/45 transition hover:bg-red-500/10 hover:text-red-300"
            >

              <LogOut
                size={17}
                strokeWidth={1.8}
              />

              Logout

            </button>

          </div>

        </aside>

        {/* ==================================================
            MOBILE SIDEBAR OVERLAY
        ================================================== */}

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />
        )}

        {/* ==================================================
            MOBILE SIDEBAR
        ================================================== */}

        <aside
          className={`fixed bottom-0 left-0 top-0 z-[100] flex w-[275px] flex-col bg-[#222022] text-white shadow-2xl transition-transform duration-300 lg:hidden ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >

          {/* Mobile Brand */}

          <div className="flex items-center justify-between px-6 pb-7 pt-7">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3D809] text-[#222022]">
                <CircleDollarSign size={21} />
              </div>

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/35">
                  Management
                </p>

                <h1 className="mt-0.5 text-lg font-black tracking-tight">
                  {brandName}
                </h1>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/50 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Close menu"
            >

              <X size={19} />

            </button>

          </div>

          {/* Mobile Navigation */}

          <nav className="flex-1 overflow-y-auto px-4">

            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
              Workspace
            </p>

            <div className="space-y-1">

              {menuItems.map((item) => {

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="group flex items-center gap-3 rounded-2xl px-3.5 py-3.5 text-sm font-medium text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
                  >

                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:scale-110"
                    />

                    <span>
                      {item.label}
                    </span>

                  </Link>
                );

              })}

            </div>

          </nav>

          {/* Mobile Bottom */}

          <div className="border-t border-white/[0.06] p-4">

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                signOut({ callbackUrl: "/admin/login" });
              }}
              className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3.5 text-sm font-medium text-white/45 transition hover:bg-red-500/10 hover:text-red-300"
            >

              <LogOut
                size={18}
                strokeWidth={1.8}
              />

              Logout

            </button>

          </div>

        </aside>

        {/* ==================================================
            MAIN AREA
        ================================================== */}

        <div className="flex min-w-0 flex-1 flex-col">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#F6F6F3]/90 backdrop-blur-xl">

            <div className="flex h-[76px] items-center justify-between px-4 sm:px-7 lg:px-10">

              {/* =================================================
                  MOBILE LEFT
              ================================================= */}

              <div className="flex items-center gap-3 lg:hidden">

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(true)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#222022] text-[#C3D809] shadow-sm transition active:scale-95"
                  aria-label="Open menu"
                >

                  <Menu size={20} />

                </button>

                <div>

                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-black/35">
                    Admin
                  </p>

                  <h1 className="text-base font-black">
                    {brandName}
                  </h1>

                </div>

              </div>

              {/* =================================================
                  DESKTOP TITLE
              ================================================= */}

              <div className="hidden lg:block">

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
                  Business management
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight">
                  Admin Dashboard
                </h2>

              </div>

              {/* =================================================
                  RIGHT SIDE
              ================================================= */}

              <div className="flex items-center gap-3">

                {/* Notification */}

                <Link
                  href="/admin/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.07] bg-white transition hover:border-[#C3D809] hover:bg-[#C3D809]"
                  aria-label="Notifications"
                >

                  <Bell
                    size={17}
                    strokeWidth={1.8}
                  />

                  {/* Notification dot */}

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C3D809]" />

                </Link>

                {/* Admin Profile */}

                <div className="flex items-center gap-3 rounded-full border border-black/[0.06] bg-white py-1.5 pl-1.5 pr-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#222022] text-[10px] font-black text-[#C3D809]">
                    {profileInitial}
                  </div>

                  <div className="hidden sm:block">

                    <p className="text-[10px] font-bold leading-none">
                      {profileName}
                    </p>

                    <p className="mt-1 text-[8px] text-black/35">
                      Administrator
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </header>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <main className="flex-1">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}

