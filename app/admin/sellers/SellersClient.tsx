"use client";

import {
  Briefcase,
  Check,
  Eye,
  EyeOff,
  Info,
  Link2,
  LockKeyhole,
  Mail,
  Plus,
  ShieldCheck,
  Store,
  User,
  Users,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

type SellerBusiness = {
  id: string;
  name: string;
  slug: string | null;
};

type Seller = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isOwner: boolean;
  createdAt: string;
  business: SellerBusiness;
};

type SellersClientProps = {
  sellerCount: number;
  initialSellers: Seller[];
};

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SellersClient({
  sellerCount,
  initialSellers,
}: SellersClientProps) {
  const [sellers, setSellers] =
    useState<Seller[]>(initialSellers);

  // -----------------------------------------------------
  // FORM STATE
  // -----------------------------------------------------

  const [formOpen, setFormOpen] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  // -----------------------------------------------------
  // PROMOTE STATE
  // -----------------------------------------------------

  const [promotingId, setPromotingId] =
    useState<string | null>(null);

  const [promoteEmail, setPromoteEmail] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isPromoting, setIsPromoting] =
    useState(false);

  const [promoteError, setPromoteError] =
    useState("");

  // -----------------------------------------------------
  // FILTER
  // -----------------------------------------------------

  const filteredSellers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return sellers;

    return sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(query) ||
        seller.email.toLowerCase().includes(query) ||
        seller.business.name.toLowerCase().includes(query)
    );
  }, [sellers, search]);

  // -----------------------------------------------------
  // VALIDATION
  // -----------------------------------------------------

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

    if (
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return "Password must include both letters and numbers.";
    }

    if (storeName.trim().length < 2) {
      return "Store name must be at least 2 characters.";
    }

    return null;
  }

  // -----------------------------------------------------
  // SUBMIT
  // -----------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/sellers", {
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
          data.error || "Failed to create seller."
        );
      }

      const newSeller: Seller = {
        id: data.business.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        isActive: true,
        isOwner: false,
        createdAt: new Date().toISOString(),
        business: {
          id: data.business.id,
          name: data.business.name,
          slug: data.business.slug,
        },
      };

      setSellers((current) => [
        ...current,
        newSeller,
      ]);

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setStoreName("");
      setFormOpen(false);

      setMessage(
        `Seller "${newSeller.business.name}" created successfully.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // -----------------------------------------------------
  // PROMOTE
  // -----------------------------------------------------

  function openPromote(seller: Seller) {
    setPromotingId(seller.id);
    setPromoteEmail(seller.email);
    setConfirmPassword("");
    setPromoteError("");
  }

  function closePromote() {
    if (isPromoting) return;
    setPromotingId(null);
    setPromoteEmail("");
    setConfirmPassword("");
    setPromoteError("");
  }

  async function handlePromote(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!promoteEmail.trim()) {
      setPromoteError("Seller email is required.");
      return;
    }

    if (confirmPassword.length === 0) {
      setPromoteError(
        "Your password is required to confirm."
      );
      return;
    }

    setIsPromoting(true);
    setPromoteError("");

    try {
      const response = await fetch(
        "/api/admin/sellers/promote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: promoteEmail,
            password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to promote seller."
        );
      }

      const targetId = promotingId;

      setSellers((current) =>
        current.map((seller) =>
          seller.id === targetId
            ? { ...seller, isOwner: true }
            : seller
        )
      );

      setPromotingId(null);
      setPromoteEmail("");
      setConfirmPassword("");

      setMessage(
        `"${data.seller?.name ?? "Seller"}" is now the platform owner.`
      );
    } catch (err) {
      setPromoteError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsPromoting(false);
    }
  }

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
            Platform management
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Sellers
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
            Create seller accounts for new stores. Each seller
            gets their own business, catalog, dashboard and
            analytics behind their own login.
          </p>
        </div>

        {/* Create button */}
        <button
          type="button"
          onClick={() => {
            setFormOpen((value) => !value);
            setError("");
            setMessage("");
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#222022] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-black active:scale-[0.98]"
        >
          {formOpen ? (
            <X size={17} />
          ) : (
            <Plus size={17} />
          )}

          {formOpen ? "Close" : "Create Seller"}
        </button>
      </div>

      {/* Status banner */}
      {message && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#C3D809]/40 bg-[#C3D809]/10 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C3D809] text-[#222022]">
            <Check size={16} />
          </span>

          <p className="text-sm font-semibold text-[#222022]">
            {message}
          </p>
        </div>
      )}

      {/* ===================================================== */}
      {/* CREATE FORM */}
      {/* ===================================================== */}

      {formOpen && (
        <section className="mt-6 rounded-[28px] border border-black/[0.07] bg-white p-5 shadow-[0_15px_50px_rgba(34,32,34,0.06)] sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#222022] text-[#C3D809]">
              <Store size={18} />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
                New account
              </p>

              <h2 className="text-lg font-black">
                Create Seller
              </h2>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/10 bg-red-50 px-4 py-3">
              <p className="text-xs font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
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
                    showPassword ? "Hide password" : "Show password"
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

              {storeName.trim().length >= 2 && (
                <p className="mt-2 truncate text-[10px] text-black/35">
                  Public store: /store/
                  {storeName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "store"}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-end justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setError("");
                }}
                className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-bold text-black/60 transition hover:bg-black/[0.03] active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#C3D809] px-6 py-3 text-sm font-black text-[#222022] shadow-[0_12px_30px_rgba(195,216,9,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(195,216,9,0.25)] active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />

                {isSubmitting
                  ? "Creating..."
                  : "Create Seller"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ===================================================== */}
      {/* SELLER LIST */}
      {/* ===================================================== */}

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
              All sellers
            </p>

            <h2 className="mt-1 text-xl font-black">
              {sellerCount}{" "}
              {sellerCount === 1 ? "seller" : "sellers"}
            </h2>
          </div>

          {/* Search */}
          <div className="group flex h-11 max-w-xs flex-1 items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 sm:max-w-[260px]">
            <Mail
              size={16}
              className="shrink-0 text-black/30"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sellers..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35"
            />
          </div>
        </div>

        {/* Count card */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C3D809]/15 text-[#222022]">
                <Users size={18} />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                  Total sellers
                </p>

                <p className="text-lg font-black">
                  {sellers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#222022]/10 text-[#222022]">
                <Store size={18} />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                  Stores
                </p>

                <p className="text-lg font-black">
                  {new Set(sellers.map((s) => s.business.id)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C3D809] text-[#222022]">
                <ShieldCheck size={18} />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                  Platform owner
                </p>

                <p className="text-lg font-black">
                  {sellers.filter((s) => s.isOwner).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller cards */}
        <div className="mt-5 space-y-3">
          {filteredSellers.map((seller) => (
            <div
              key={seller.id}
              className="rounded-3xl border border-black/[0.07] bg-white p-5 transition-all duration-300 hover:border-[#C3D809]/40 hover:shadow-[0_15px_45px_rgba(34,32,34,0.06)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#222022] text-lg font-black text-[#C3D809]">
                  {seller.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black">
                      {seller.name}
                    </p>

                    {seller.isOwner && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#222022] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#C3D809]">
                        <ShieldCheck size={11} />
                        Owner
                      </span>
                    )}

                    {!seller.isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-black/50">
                    <Mail size={13} />
                    {seller.email}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-black/40">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase size={13} />
                      {seller.business.name}
                    </span>

                    {seller.business.slug && (
                      <span className="inline-flex items-center gap-1.5 font-medium text-black/50">
                        <Link2 size={13} />
                        /store/{seller.business.slug}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {!seller.isOwner && (
                    <button
                      type="button"
                      disabled={isPromoting}
                      onClick={() => openPromote(seller)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 px-3 py-2 text-xs font-bold text-black/60 transition-colors hover:border-[#C3D809] hover:bg-[#C3D809]/10 hover:text-[#222022] disabled:opacity-50"
                    >
                      <ShieldCheck size={14} />
                      Make owner
                    </button>
                  )}
                </div>
              </div>

              {/* Promote panel */}
              {promotingId === seller.id && (
                <form
                  onSubmit={handlePromote}
                  className="mt-4 rounded-2xl border border-[#C3D809]/40 bg-[#C3D809]/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-black/50">
                      Promote to platform owner
                    </p>

                    <button
                      type="button"
                      onClick={closePromote}
                      disabled={isPromoting}
                      className="text-black/40 transition-colors hover:text-black disabled:opacity-50"
                      aria-label="Close"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/45">
                        Seller email
                      </span>

                      <input
                        value={promoteEmail}
                        onChange={(event) =>
                          setPromoteEmail(
                            event.target.value
                          )
                        }
                        placeholder="seller@example.com"
                        className="mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition-colors placeholder:text-black/30 focus:border-[#C3D809]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-black/45">
                        Your password to confirm
                      </span>

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        placeholder="Owner password"
                        className="mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none transition-colors placeholder:text-black/30 focus:border-[#C3D809]"
                      />
                    </label>
                  </div>

                  {promoteError && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                      <Info size={13} />
                      {promoteError}
                    </p>
                  )}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isPromoting}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#222022] px-4 py-2.5 text-xs font-bold text-[#C3D809] transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isPromoting ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#C3D809]/30 border-t-[#C3D809]" />
                          Promoting...
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} />
                          Confirm promote
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}

          {filteredSellers.length === 0 && (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C3D809]/15">
                <Users size={22} className="text-[#222022]" />
              </div>

              <h3 className="mt-4 font-black">
                No sellers found
              </h3>

              <p className="mx-auto mt-1 max-w-[280px] text-sm text-black/40">
                Try a different search, or create a new seller
                to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info note */}
      <p className="mt-8 flex items-center gap-2 text-xs text-black/35">
        <Info size={14} />
        Sellers created here log in through /admin/login with
        their own email and password. Use the Make owner button
        to grant platform-owner access (confirmed with your
        password).
      </p>
    </div>
  );
}
