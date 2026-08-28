import { Suspense } from "react";
import { getAdminPurchasesData } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";
import PurchasesClient from "./PurchasesClient";

export default function PurchasesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <PurchasesContent />
    </Suspense>
  );
}

async function PurchasesContent() {
  const business = await requireAdminSession();

  const products =
    await getAdminPurchasesData(
      business.businessId
    );

  return (
    <PurchasesClient
      products={
        products
      }
    />
  );
}