"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StoreQrCode from "@/components/admin/StoreQrCode";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  Save,
  Store,
  MapPin,
  Phone,
  Send,
   Camera,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  LogIn,
} from "lucide-react";

type Settings = {
  name: string;
  slug: string;
  address: string;
  phone: string;
  telegram: string;
  instagram: string;
  openingHours: string;
  description: string;
  logoUrl: string;
  aboutImageUrl: string;
  promoImageUrl: string;
  categoryImageUrl: string;
};

const defaultSettings: Settings = {
  name: "",
  slug: "",
  address: "",
  phone: "",
  telegram: "",
  instagram: "",
  openingHours: "",
  description: "",
  logoUrl: "",
  aboutImageUrl: "",
  promoImageUrl: "",
  categoryImageUrl: "",
};

export default function StoreSettingsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/settings");

      if (response.status === 401) {
        setSignedOut(true);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load settings");
      }

      const business = data.settings;

      setSettings({
        name: business.name || "",
        slug: business.slug || "",
        address: business.address || "",
        phone: business.phone || "",
        telegram: business.telegram || "",
        instagram: business.instagram || "",
        openingHours: business.openingHours || "",
        description: business.description || "",
        logoUrl: business.logoUrl || "",
        aboutImageUrl: business.aboutImageUrl || "",
        promoImageUrl: business.promoImageUrl || "",
        categoryImageUrl:
          business.categoryImageUrl || "",
      });
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load settings"
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof Settings,
    value: string
  ) {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.status === 401) {
        setSignedOut(true);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save settings"
        );
      }

      setSettings({
        name: data.settings.name || "",
        slug: data.settings.slug || "",
        address: data.settings.address || "",
        phone: data.settings.phone || "",
        telegram: data.settings.telegram || "",
        instagram: data.settings.instagram || "",
        openingHours:
          data.settings.openingHours || "",
        description:
          data.settings.description || "",
        logoUrl: data.settings.logoUrl || "",
        aboutImageUrl:
          data.settings.aboutImageUrl || "",
        promoImageUrl:
          data.settings.promoImageUrl || "",
        categoryImageUrl:
          data.settings.categoryImageUrl || "",
      });

      setMessage("Store settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] p-6">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded-lg bg-black/10" />
            <div className="mt-3 h-4 w-72 rounded bg-black/5" />

            <div className="mt-8 h-[600px] rounded-3xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (signedOut) {
    return (
      <main className="min-h-screen bg-[#f8f8f6] px-4 py-6 md:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center text-center">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#222022] text-[#C3D809]">
              <LogIn size={24} />
            </div>

            <h1 className="mt-5 text-xl font-black tracking-tight">
              Sign in required
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/45">
              Your session has expired or is missing. Sign in again
              to manage your store settings.
            </p>

            <Link
              href="/admin/login"
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#C3D809] text-sm font-black text-[#222022] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Sign in
              <LogIn size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C3D809]">
              <Store size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                Store Settings
              </h1>

              <p className="mt-1 text-sm text-black/45">
                Manage your store information and branding.
              </p>
            </div>
          </div>
        </div>

        {/* Success */}
        {message && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="space-y-6">

          {/* ===================================================== */}
          {/* STORE INFORMATION */}
          {/* ===================================================== */}

          <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-black">
                Store Information
              </h2>

              <p className="mt-1 text-xs text-black/40">
                Basic information displayed throughout the website.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Store Name */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/45">
                  Store Name
                </label>

                <div className="relative">
                  <Store
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    value={settings.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="Mulat Mobile Store"
                    className="w-full rounded-2xl border border-black/10 bg-[#f8f8f6] py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#C3D809] focus:bg-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/45">
                  Address
                </label>

                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    value={settings.address}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    placeholder="Wereta, Ethiopia"
                    className="w-full rounded-2xl border border-black/10 bg-[#f8f8f6] py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#C3D809] focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/45">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    value={settings.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    placeholder="+251 92 049 9857"
                    className="w-full rounded-2xl border border-black/10 bg-[#f8f8f6] py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#C3D809] focus:bg-white"
                  />
                </div>
              </div>

              {/* Telegram */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/45">
                  Telegram
                </label>

                <div className="relative">
                  <Send
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    value={settings.telegram}
                    onChange={(e) =>
                      updateField("telegram", e.target.value)
                    }
                    placeholder="@username"
                    className="w-full rounded-2xl border border-black/10 bg-[#f8f8f6] py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#C3D809] focus:bg-white"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/45">
                  Instagram
                </label>

                <div className="relative">
                  <Camera
  size={17}
  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
/>

                  <input
                    value={settings.instagram}
                    onChange={(e) =>
                      updateField("instagram", e.target.value)
                    }
                    placeholder="@username"
                    className="w-full rounded-2xl border border-black/10 bg-[#f8f8f6] py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#C3D809] focus:bg-white"
                  />
                </div>
              </div>

              {/* Opening Hours */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/45">
                  Opening Hours
                </label>

                <div className="relative">
                  <Clock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                  />

                  <input
                    value={settings.openingHours}
                    onChange={(e) =>
                      updateField(
                        "openingHours",
                        e.target.value
                      )
                    }
                    placeholder="Every day • 8:00 AM – 8:00 PM"
                    className="w-full rounded-2xl border border-black/10 bg-[#f8f8f6] py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#C3D809] focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/45">
                  Description
                </label>

                <div className="relative">
                  <FileText
                    size={17}
                    className="absolute left-4 top-4 text-black/30"
                  />

                  <textarea
                    value={settings.description}
                    onChange={(e) =>
                      updateField(
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Quality mobile accessories and useful everyday tech."
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-black/10 bg-[#f8f8f6] py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-[#C3D809] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================== */}
          {/* IMAGE SETTINGS */}
          {/* ===================================================== */}

          <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-black">
                Store Images
              </h2>

              <p className="mt-1 text-xs text-black/40">
                These images control the visual branding of your public store.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Logo */}
              <ImageField
                title="Store Logo"
                description="Your main store logo."
                value={settings.logoUrl}
                field="logo"
                onChange={(value) =>
                  updateField("logoUrl", value)
                }
              />

              {/* About */}
              <ImageField
                title="About Page Image"
                description="Image displayed on the About page card."
                value={settings.aboutImageUrl}
                field="about"
                onChange={(value) =>
                  updateField("aboutImageUrl", value)
                }
              />

              {/* Promo */}
              <ImageField
                title="Promo Bar Image"
                description="Image displayed in the promotional card."
                value={settings.promoImageUrl}
                field="promo"
                onChange={(value) =>
                  updateField("promoImageUrl", value)
                }
              />

              {/* Category */}
              <ImageField
                title="Category Page Image"
                description="Image displayed on the category page card."
                value={settings.categoryImageUrl}
                field="category"
                onChange={(value) =>
                  updateField(
                    "categoryImageUrl",
                    value
                  )
                }
              />
            </div>
          </section>

          {/* ===================================================== */}
          {/* STORE QR CODE */}
          {/* ===================================================== */}

          {settings.slug && (
            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-7">
              <div className="mb-6">
                <h2 className="text-lg font-black">
                  Share Your Store
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Your unique public catalog lives at{" "}
                  <Link
                    href={`/store/${settings.slug}`}
                    className="font-bold text-[#222022] underline decoration-[#C3D809]/50 underline-offset-2"
                  >
                    /store/{settings.slug}
                  </Link>
                  . Share the QR code with customers so they can
                  open it instantly on their phone.
                </p>
              </div>

              <div className="flex justify-center md:justify-start">
                <StoreQrCode
                  url={`${window.location.origin}/store/${settings.slug}`}
                  storeName={settings.name}
                />
              </div>
            </section>
          )}

          {/* ===================================================== */}
          {/* SAVE */}
          {/* ===================================================== */}

          <div className="flex justify-end pb-8">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-[#222022] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function ImageField({
  title,
  description,
  value,
  field,
  onChange,
}: {
  title: string;
  description: string;
  value: string;
  field: string;
  onChange: (value: string) => void;
}) {
  return (
    <ImageUploader
      label={title}
      description={description}
      value={value}
      onChange={onChange}
      field={field}
    />
  );
}