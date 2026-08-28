import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSessionBusiness } from "@/lib/admin/session";

// =========================================================
// GET CATEGORIES
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

    const categories =
      await prisma.category.findMany({
        where: {
          businessId: session.businessId,
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
      name,
    } = body;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

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

    // -----------------------------------------------------
    // INVALIDATE CACHED CATALOG
    // -----------------------------------------------------

    revalidateTag("catalog", "max");
    revalidateTag("admin", "max");

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