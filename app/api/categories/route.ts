import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================================================
// GET CATEGORIES
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

    const categories =
      await prisma.category.findMany({
        where: {
          businessId,
        },

        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },

        orderBy: {
          name: "asc",
        },
      });

    const safeCategories =
      categories.map((category) => ({
        id: category.id,
        name: category.name,
        productCount:
          category._count.products,
        businessId:
          category.businessId,
        createdAt:
          category.createdAt,
        updatedAt:
          category.updatedAt,
      }));

    return NextResponse.json(
      safeCategories
    );
  } catch (error) {
    console.error(
      "GET CATEGORIES ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch categories.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// CREATE CATEGORY
// =========================================================

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      businessId,
      name,
    } = body;

    // -----------------------------------------------------
    // VALIDATION
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

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Category name is required.",
        },
        {
          status: 400,
        }
      );
    }

    const categoryName =
      name.trim();

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
    // CHECK DUPLICATE CATEGORY
    // -----------------------------------------------------

    const existingCategory =
      await prisma.category.findFirst({
        where: {
          businessId,
          name: categoryName,
        },
      });

    if (existingCategory) {
      return NextResponse.json(
        {
          error:
            "A category with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // -----------------------------------------------------
    // CREATE CATEGORY
    // -----------------------------------------------------

    const category =
      await prisma.category.create({
        data: {
          name: categoryName,
          businessId,
        },
      });

    return NextResponse.json(
      {
        success: true,

        category: {
          id: category.id,
          name: category.name,
          productCount: 0,
          businessId:
            category.businessId,
          createdAt:
            category.createdAt,
          updatedAt:
            category.updatedAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE CATEGORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create category.",
      },
      {
        status: 500,
      }
    );
  }
}