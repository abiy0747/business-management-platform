import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSessionBusiness } from "@/lib/admin/session";

// =========================================================
// CREATE PRODUCT
// POST /api/products
// =========================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      price,
      costPrice,
      stock,
      imageUrl,
      categoryId,
      isAvailable,
    } = body;

    // -----------------------------------------------------
    // AUTHENTICATION
    // The business is derived from the session, never from
    // the client. This keeps every seller isolated from
    // other sellers' data.
    // -----------------------------------------------------

    const session = await getAdminSessionBusiness();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const businessId = session.businessId;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          error: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof categoryId !== "string" ||
      !categoryId.trim()
    ) {
      return NextResponse.json(
        {
          error: "Category is required.",
        },
        { status: 400 }
      );
    }

    const numericPrice = Number(price);
    const numericCostPrice = Number(costPrice);
    const numericStock = Number(stock);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Selling price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(numericCostPrice) ||
      numericCostPrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Cost price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Stock must be a whole number greater than or equal to 0.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // VERIFY CATEGORY
    // -----------------------------------------------------

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        businessId,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Selected category does not belong to this business.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // CREATE PRODUCT
    // -----------------------------------------------------

    const product = await prisma.product.create({
      data: {
        name: name.trim(),

        description:
          typeof description === "string" &&
          description.trim()
            ? description.trim()
            : null,

        price: numericPrice,

        costPrice: numericCostPrice,

        stock: numericStock,

        imageUrl:
          typeof imageUrl === "string" &&
          imageUrl.trim()
            ? imageUrl.trim()
            : null,

        isAvailable:
          typeof isAvailable === "boolean"
            ? isAvailable
            : true,

        businessId,

        categoryId,
      },

      include: {
        category: true,
      },
    });

    // -----------------------------------------------------
    // INVALIDATE CACHED CATALOG
    // -----------------------------------------------------

    revalidateTag("catalog", "max");
    revalidateTag("admin", "max");

    // -----------------------------------------------------
    // RETURN SAFE JSON
    // -----------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          costPrice: Number(product.costPrice),
          stock: product.stock,
          imageUrl: product.imageUrl,
          isAvailable: product.isAvailable,
          businessId: product.businessId,
          categoryId: product.categoryId,

          category: {
            id: product.category.id,
            name: product.category.name,
          },

          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create product.",
      },
      {
        status: 500,
      }
    );
  }
}