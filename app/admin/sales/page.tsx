import { Suspense } from "react";
import { getAdminSalesData } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";
import SalesClient from "./SalesClient";

export default function SalesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <SalesContent />
    </Suspense>
  );
}

async function SalesContent() {
  const business = await requireAdminSession();

  const products = await getAdminSalesData(business.businessId);

  return (
    <SalesClient
      products={products}
    />
  );
}