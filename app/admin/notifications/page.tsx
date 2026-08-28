import { Suspense } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Package,
} from "lucide-react";
import { getAdminNotificationsData } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";

export default function NotificationsPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <NotificationsContent />
    </Suspense>
  );
}

async function NotificationsContent() {
  const business = await requireAdminSession();

  const lowStockProducts =
    await getAdminNotificationsData(
      business.businessId
    );

  return (
    <div className="min-h-screen px-4 py-6 sm:px-7 lg:px-10">

      {/* Header */}

      <div className="mb-8">

        <Link
          href="/admin/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-black/40 transition hover:text-[#222022]"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>

        <div className="flex items-end justify-between gap-4">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">
              Alerts
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-black/40">
              Important stock alerts for your business.
            </p>
          </div>

          <div className="flex h-11 min-w-11 items-center justify-center rounded-2xl bg-[#222022] px-3 text-sm font-black text-[#C3D809]">
            {lowStockProducts.length}
          </div>

        </div>

      </div>

      {/* Notifications */}

      {lowStockProducts.length === 0 ? (
        <div className="rounded-[28px] border border-black/[0.06] bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C3D809]/15 text-[#222022]">
            <Package size={24} />
          </div>

          <h2 className="mt-5 text-lg font-black">
            All stock levels look good
          </h2>

          <p className="mt-2 text-sm text-black/40">
            There are no products with 2 or fewer items in stock.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {lowStockProducts.map((product) => {

            const outOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5"
              >

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    outOfStock
                      ? "bg-red-500/10 text-red-500"
                      : "bg-orange-500/10 text-orange-500"
                  }`}
                >
                  <AlertTriangle size={21} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="font-black text-[#222022]">
                      {product.name}
                    </h2>

                    <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-bold text-black/40">
                      {product.categoryName}
                    </span>

                  </div>

                  <p className="mt-1 text-sm text-black/40">
                    {outOfStock
                      ? "This product is out of stock."
                      : `Only ${product.stock} ${
                          product.stock === 1
                            ? "item"
                            : "items"
                        } remaining.`}
                  </p>

                </div>

                <div
                  className={`shrink-0 text-right ${
                    outOfStock
                      ? "text-red-500"
                      : "text-orange-500"
                  }`}
                >
                  <p className="text-xl font-black">
                    {product.stock}
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-wider">
                    Stock
                  </p>
                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}