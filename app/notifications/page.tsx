import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Tag,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
  // Get the first business
  const business = await prisma.business.findFirst();

  // Get active notifications for that business
  const notifications = business
    ? await prisma.notification.findMany({
        where: {
          businessId: business.id,
          isActive: true,
          OR: [
            {
              startDate: null,
            },
            {
              startDate: {
                lte: new Date(),
              },
            },
          ],
          AND: [
            {
              OR: [
                {
                  endDate: null,
                },
                {
                  endDate: {
                    gte: new Date(),
                  },
                },
              ],
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#222022]">
      <div className="mx-auto min-h-screen max-w-md bg-white">
        {/* Header */}
        <header className="flex items-center gap-4 border-b border-black/5 px-5 py-5">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white transition-transform active:scale-90"
            aria-label="Back"
          >
            <ArrowLeft size={19} strokeWidth={1.8} />
          </Link>

          <div>
            <h1 className="text-xl font-black tracking-tight">
              Notifications
            </h1>

            <p className="mt-0.5 text-xs text-black/45">
              Latest updates and offers
            </p>
          </div>
        </header>

        {/* Notifications */}
        <section className="px-5 py-6">
          {notifications.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C3D809]/15">
                <Bell size={28} strokeWidth={1.6} />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                No notifications
              </h2>

              <p className="mt-2 max-w-xs text-sm leading-6 text-black/45">
                You&apos;ll see discounts, new arrivals and important
                updates here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C3D809]/15">
                      {notification.type === "DISCOUNT" ? (
                        <Tag size={20} strokeWidth={1.8} />
                      ) : (
                        <Sparkles size={20} strokeWidth={1.8} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="font-bold">
                          {notification.title}
                        </h2>

                        <ChevronRight
                          size={17}
                          className="mt-0.5 shrink-0 text-black/30"
                        />
                      </div>

                      <p className="mt-1 text-sm leading-5 text-black/55">
                        {notification.message}
                      </p>

                      {notification.discount !== null && (
                        <p className="mt-2 text-sm font-bold">
                          {Number(notification.discount)}% OFF
                        </p>
                      )}

                      <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-black/35">
                        {new Date(
                          notification.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}