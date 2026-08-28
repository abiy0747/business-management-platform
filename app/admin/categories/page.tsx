import { Suspense } from "react";
import { getAdminCategoriesData } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";
import CategoriesClient from "./CategoriesClient";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <CategoriesContent />
    </Suspense>
  );
}

async function CategoriesContent() {
  const business = await requireAdminSession();

  const categories = await getAdminCategoriesData(business.businessId);

  return (
    <CategoriesClient
      categories={categories}
    />
  );
}