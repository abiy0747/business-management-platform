import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSessionBusiness } from "@/lib/admin/session";

// =========================================================
// GET EXPENSES
// =========================================================

export async function GET() {
  try {
    // -----------------------------------------------------
    // AUTHENTICATION
    // -----------------------------------------------------

    const session =
      await getAdminSessionBusiness();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const expenses =
      await prisma.expense.findMany({
        where: {
          businessId: session.businessId,
        },
        orderBy: {
          expenseDate: "desc",
        },
      });

    const safeExpenses =
      expenses.map((expense) => ({
        id: expense.id,
        title: expense.title,
        description:
          expense.description,
        amount: Number(
          expense.amount
        ),
        expenseDate:
          expense.expenseDate,
        createdAt:
          expense.createdAt,
        updatedAt:
          expense.updatedAt,
        businessId:
          expense.businessId,
      }));

    return NextResponse.json(
      safeExpenses
    );
  } catch (error) {
    console.error(
      "GET EXPENSES ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch expenses.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// CREATE EXPENSE
// =========================================================

export async function POST(
  request: Request
) {
  try {
    // -----------------------------------------------------
    // AUTHENTICATION
    // -----------------------------------------------------

    const session =
      await getAdminSessionBusiness();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const businessId = session.businessId;

    const body =
      await request.json();

    const {
      title,
      description,
      amount,
      expenseDate,
    } = body;

    // -----------------------------------------------------
    // VALIDATE TITLE
    // -----------------------------------------------------

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Expense title is required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------------------
    // VALIDATE AMOUNT
    // -----------------------------------------------------

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Expense amount must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------------------
    // PARSE EXPENSE DATE
    // -----------------------------------------------------

    let parsedExpenseDate =
      new Date();

    if (expenseDate) {
      const date =
        new Date(expenseDate);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid expense date.",
          },
          {
            status: 400,
          }
        );
      }

      parsedExpenseDate = date;
    }

    // -----------------------------------------------------
    // CREATE EXPENSE
    // -----------------------------------------------------

    const expense =
      await prisma.expense.create({
        data: {
          title: title.trim(),

          description:
            typeof description ===
              "string" &&
            description.trim()
              ? description.trim()
              : null,

          amount:
            numericAmount,

          expenseDate:
            parsedExpenseDate,

          businessId,
        },
      });

    // -----------------------------------------------------
    // INVALIDATE CACHED ADMIN DATA
    // -----------------------------------------------------

    revalidateTag("admin", "max");

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Expense created successfully.",

        expense: {
          id: expense.id,

          title:
            expense.title,

          description:
            expense.description,

          amount: Number(
            expense.amount
          ),

          expenseDate:
            expense.expenseDate,

          createdAt:
            expense.createdAt,

          businessId:
            expense.businessId,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE EXPENSE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create expense.",
      },
      {
        status: 500,
      }
    );
  }
}