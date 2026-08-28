"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Smartphone,
  Store,
  User,
} from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validate(): string | null {
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters.";
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return "Enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return "Password must include both letters and numbers.";
    }

    if (storeName.trim().length < 2) {
      return "Store name must be at least 2 characters.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          storeName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create account."
        );
      }

      // -----------------------------------------------------
      // AUTO SIGN-IN
      // -----------------------------------------------------

      const signInResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/admin/login");
        router.refresh();
        return;
      }

      router.push("/admin/settings");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#222022]">
      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center overflow-hidden px-5 py-12">

        {/* ===================================================== */}
        {/* BACKGROUND DECORATION */}
        {/* ===================================================== */}

        <div className="pointer-events-none absolute -right-28 -top-20 h-72 w-72 rounded-full bg-[#C3D809]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-black/[0.035] blur-3xl" />

        {/* ===================================================== */}
        {/* REGISTER CARD */}
        {/* ===================================================== */}

        <div className="relative z-10 w-full">

          {/* Brand */}
          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#222022] text-[#C3D809] shadow-[0_20px_50px_rgba(34,32,34,0.18)]">
              <Smartphone size={28} strokeWidth={2} />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
              Open your store
            </p>

            <h1 className="mt-2 text-[32px] font-black tracking-tight">
              Create Your Store
            </h1>

            <p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-black/45">
              Launch your own public store with your own catalog,
              dashboard and analytics.
            </p>

          </div>

          {/* Card */}
          <div className="rounded-[30px] border border-black/[0.06] bg-white p-6 shadow-[0_25px_70px_rgba(34,32,34,0.10)]">

            {/* Card heading */}
            <div className="mb-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                Seller account
              </p>

              <h2 className="mt-2 text-xl font-black">
                Let&apos;s get started.
              </h2>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/10 bg-red-50 px-4 py-3">
                <p className="text-xs font-semibold text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Full name */}
              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/40"
                >
                  Full name
                </label>

                <div className="group relative">

                  <User
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30 transition-colors group-focus-within:text-[#222022]"
                  />

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Abebe Kebede"
                    required
                    autoComplete="name"
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#F8F8F6] pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-black/25 focus:border-[#C3D809] focus:bg-white focus:ring-4 focus:ring-[#C3D809]/10"
                  />

                </div>

              </div>

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/40"
                >
                  Email address
                </label>

                <div className="group relative">

                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30 transition-colors group-focus-within:text-[#222022]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seller@example.com"
                    required
                    autoComplete="email"
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#F8F8F6] pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-black/25 focus:border-[#C3D809] focus:bg-white focus:ring-4 focus:ring-[#C3D809]/10"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/40"
                >
                  Password
                </label>

                <div className="group relative">

                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30 transition-colors group-focus-within:text-[#222022]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    required
                    autoComplete="new-password"
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#F8F8F6] pl-11 pr-12 text-sm font-medium outline-none transition-all placeholder:text-black/25 focus:border-[#C3D809] focus:bg-white focus:ring-4 focus:ring-[#C3D809]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-black/35 transition-all hover:bg-black/5 hover:text-black active:scale-90"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* Store name */}
              <div>

                <label
                  htmlFor="storeName"
                  className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-black/40"
                >
                  Store name
                </label>

                <div className="group relative">

                  <Store
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30 transition-colors group-focus-within:text-[#222022]"
                  />

                  <input
                    id="storeName"
                    type="text"
                    value={storeName}
                    onChange={(event) => setStoreName(event.target.value)}
                    placeholder="Abebe Mobile Store"
                    required
                    autoComplete="organization"
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#F8F8F6] pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-black/25 focus:border-[#C3D809] focus:bg-white focus:ring-4 focus:ring-[#C3D809]/10"
                  />

                </div>

                <p className="mt-2 text-[10px] text-black/30">
                  Your public store will be available at /store/abebe-mobile-store
                </p>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#C3D809] text-sm font-black text-[#222022] shadow-[0_12px_30px_rgba(195,216,9,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(195,216,9,0.25)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {/* Shine */}
                <span className="pointer-events-none absolute inset-y-0 -left-20 w-12 skew-x-[-20deg] bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[500px]" />

                <span className="relative">
                  {loading ? "Creating your store..." : "Create my store"}
                </span>

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="relative transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            {/* Existing seller */}
            <div className="mt-6 text-center">

              <p className="text-xs text-black/40">
                Already have a store?{" "}

                <Link
                  href="/admin/login"
                  className="font-bold text-[#222022] transition hover:text-[#3d3d3d]"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-[0.15em] text-black/25">
            Business Management System
          </p>

        </div>
      </div>
    </main>
  );
}