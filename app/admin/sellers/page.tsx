import { Suspense } from "react";
import { requireOwnerSession } from "@/lib/admin/session";
import { getAdminSellersData } from "@/lib/admin/data";
import { AdminPageSkeleton } from "@/components/Skeletons";
import SellersClient from "./SellersClient";

export default function SellersPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <SellersContent />
    </Suspense>
  );
}

async function SellersContent() {
  // Platform-owner only. Redirects non-owner / unauthenticated
  // users away from this page.
  await requireOwnerSession();

  const sellers = await getAdminSellersData();

  return (
    <SellersClient
      sellerCount={sellers.length}
      initialSellers={sellers}
    />
  );
}
