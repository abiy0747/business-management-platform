import DashboardClient from "./DashboardClient";
import { getDashboardData } from "@/lib/admin/dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const business = await prisma.business.findFirst();

  if (!business) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-black/40">
          No business found. Please run the seed script.
        </p>
      </div>
    );
  }

  const raw = await getDashboardData(business.id);

  const data = JSON.parse(JSON.stringify(raw));

  return <DashboardClient data={data} />;
}
