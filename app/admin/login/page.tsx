"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Smartphone,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#222022]">
      <div className="relative mx-auto flex min-h-screen max-w-md items-center justify-center overflow-hidden px-5">

        {/* ===================================================== */}
        {/* BACKGROUND DECORATION */}
        {/* ===================================================== */}

        <div className="pointer-events-none absolute -right-28 -top-20 h-72 w-72 rounded-full bg-[#C3D809]/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-black/[0.035] blur-3xl" />

        {/* ===================================================== */}
        {/* LOGIN CARD */}
        {/* ===================================================== */}

        <div className="relative z-10 w-full">

          {/* Brand */}
          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#222022] text-[#C3D809] shadow-[0_20px_50px_rgba(34,32,34,0.18)]">
              <Smartphone size={28} strokeWidth={2} />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
              Store
            </p>

            <h1 className="mt-2 text-[32px] font-black tracking-tight">
              Admin Portal
            </h1>

            <p className="mx-auto mt-3 max-w-[260px] text-sm leading-6 text-black/45">
              Manage your products, inventory, sales and business performance.
            </p>

          </div>

          {/* Card */}
          <div className="rounded-[30px] border border-black/[0.06] bg-white p-6 shadow-[0_25px_70px_rgba(34,32,34,0.10)]">

            {/* Card heading */}
            <div className="mb-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
                Secure access
              </p>

              <h2 className="mt-2 text-xl font-black">
                Welcome back.
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
                    placeholder="admin@example.com"
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
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#C3D809] text-sm font-black text-[#222022] shadow-[0_12px_30px_rgba(195,216,9,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(195,216,9,0.25)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {/* Shine */}
                <span className="pointer-events-none absolute inset-y-0 -left-20 w-12 skew-x-[-20deg] bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[500px]" />

                <span className="relative">
                  {loading ? "Signing in..." : "Sign in"}
                </span>

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="relative transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            {/* Security */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center">

              <LockKeyhole
                size={12}
                className="text-black/25"
              />

              <p className="text-[9px] font-medium uppercase tracking-wider text-black/30">
                Secure administrator access
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