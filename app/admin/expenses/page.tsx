import { prisma } from "@/lib/prisma";
import ExpensesClient from "./ExpensesClient";

export default async function ExpensesPage() {
  const business = await prisma.business.findFirst();

  if (!business) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5">
        <div className="text-center">
          <h2 className="text-lg font-black text-[#222022]">
            No business found
          </h2>

          <p className="mt-2 text-sm text-black/40">
            Please run the seed script first.
          </p>
        </div>
      </div>
    );
  }

  const expenses =
    await prisma.expense.findMany({
      where: {
        businessId: business.id,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });

  const safeExpenses = expenses.map(
    (expense) => ({
      id: expense.id,
      title: expense.title,
      description:
        expense.description,
      amount: Number(
        expense.amount
      ),
      expenseDate:
        expense.expenseDate.toISOString(),
      createdAt:
        expense.createdAt.toISOString(),
      updatedAt:
        expense.updatedAt.toISOString(),
    })
  );

  return (
    <ExpensesClient
      businessId={business.id}
      initialExpenses={
        safeExpenses
      }
    />
  );
}