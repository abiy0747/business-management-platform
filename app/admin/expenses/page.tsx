import { Suspense } from "react";
import { getAdminExpensesData } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/session";
import { AdminPageSkeleton } from "@/components/Skeletons";
import ExpensesClient from "./ExpensesClient";

export default function ExpensesPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <ExpensesContent />
    </Suspense>
  );
}

async function ExpensesContent() {
  const business = await requireAdminSession();

  const expenses =
    await getAdminExpensesData(
      business.businessId
    );

  return (
    <ExpensesClient
      initialExpenses={
        expenses
      }
    />
  );
}