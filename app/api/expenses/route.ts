import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================================================
// GET EXPENSES
// =========================================================

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const businessId =
      url.searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        {
          error: "Business ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const expenses =
      await prisma.expense.findMany({
        where: {
          businessId,
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
    const body =
      await request.json();

    const {
      businessId,
      title,
      description,
      amount,
      expenseDate,
    } = body;

    // -----------------------------------------------------
    // VALIDATE BUSINESS ID
    // -----------------------------------------------------

    if (
      typeof businessId !==
        "string" ||
      !businessId.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Business ID is required.",
        },
        {
          status: 400,
        }
      );
    }

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
    // VERIFY BUSINESS
    // -----------------------------------------------------

    const business =
      await prisma.business.findUnique({
        where: {
          id: businessId,
        },
      });

    if (!business) {
      return NextResponse.json(
        {
          error:
            "Business not found.",
        },
        {
          status: 404,
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