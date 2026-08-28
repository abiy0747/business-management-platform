import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSessionBusiness } from "@/lib/admin/session";

// =========================================================
// TYPES
// =========================================================

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// =========================================================
// UPDATE EXPENSE
// PUT /api/expenses/[id]
// =========================================================

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Expense ID is required." },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // AUTHENTICATION
    // -----------------------------------------------------

    const session = await getAdminSessionBusiness();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const businessId = session.businessId;

    const existing = await prisma.expense.findFirst({
      where: {
        id,
        businessId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Expense not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      amount,
      expenseDate,
    } = body;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Expense title is required." },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Expense amount must be greater than zero." },
        { status: 400 }
      );
    }

    let parsedExpenseDate = existing.expenseDate;

    if (expenseDate) {
      const date = new Date(expenseDate);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          { error: "Invalid expense date." },
          { status: 400 }
        );
      }

      parsedExpenseDate = date;
    }

    // -----------------------------------------------------
    // UPDATE EXPENSE
    // -----------------------------------------------------

    const expense = await prisma.expense.update({
      where: {
        id: existing.id,
      },

      data: {
        title: title.trim(),
        description:
          typeof description === "string" && description.trim()
            ? description.trim()
            : null,
        amount: numericAmount,
        expenseDate: parsedExpenseDate,
      },
    });

    // -----------------------------------------------------
    // INVALIDATE CACHED ADMIN DATA
    // -----------------------------------------------------

    revalidateTag("admin", "max");

    return NextResponse.json({
      success: true,
      message: "Expense updated successfully.",
      expense,
    });
  } catch (error) {
    console.error("UPDATE EXPENSE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update expense." },
      { status: 500 }
    );
  }
}

// =========================================================
// DELETE EXPENSE
// DELETE /api/expenses/[id]
// =========================================================

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Expense ID is required." },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // AUTHENTICATION
    // -----------------------------------------------------

    const session = await getAdminSessionBusiness();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // -----------------------------------------------------
    // FIND EXPENSE
    // -----------------------------------------------------

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        businessId: session.businessId,
      },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found." },
        { status: 404 }
      );
    }

    // -----------------------------------------------------
    // DELETE EXPENSE
    // -----------------------------------------------------

    await prisma.expense.delete({
      where: {
        id: expense.id,
      },
    });

    // -----------------------------------------------------
    // INVALIDATE CACHED ADMIN DATA
    // -----------------------------------------------------

    revalidateTag("admin", "max");

    return NextResponse.json({
      success: true,
      message: "Expense deleted successfully.",
      deletedExpenseId: expense.id,
    });
  } catch (error) {
    console.error("DELETE EXPENSE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete expense." },
      { status: 500 }
    );
  }
}