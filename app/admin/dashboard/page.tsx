import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import { getAdminDashboardData } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const business = await requireAdminSession();

  const data = await getAdminDashboardData(business.businessId);

  return <DashboardClient data={data} />;
}
