import Link from "next/link";
import {
  ArrowLeft,
  
  ChevronRight,
  Tag,
  Sparkles,
} from "lucide-react";
import { getNotificationsData } from "@/lib/catalog-data";

export default async function NotificationsPage() {
  // Active notifications are cached to keep
  // navigation to this page instant.
  const notifications = await getNotificationsData();

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#222022]">
      <div className="mx-auto min-h-screen max-w-md bg-white">
        {/* Header */}
        <header className="flex items-center gap-4 border-b border-black/5 px-5 py-5">
          <Link
            href="/catalog"
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

       
      </div>
    </main>
  );
}