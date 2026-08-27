import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// =========================================================
// UPDATE CATEGORY
// =========================================================

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

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
      !id ||
      typeof id !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Category ID is required.",
        },
        {
          status: 400,
        }
      );
    }

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
    // FIND CATEGORY
    // -----------------------------------------------------

    const existingCategory =
      await prisma.category.findFirst({
        where: {
          id,
          businessId,
        },
      });

    if (!existingCategory) {
      return NextResponse.json(
        {
          error:
            "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------------------
    // CHECK DUPLICATE NAME
    // -----------------------------------------------------

    const duplicate =
      await prisma.category.findFirst({
        where: {
          businessId,
          name: categoryName,

          NOT: {
            id,
          },
        },
      });

    if (duplicate) {
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
    // UPDATE
    // -----------------------------------------------------

    const category =
      await prisma.category.update({
        where: {
          id,
        },

        data: {
          name: categoryName,
        },

        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,

      category: {
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
      },
    });
  } catch (error) {
    console.error(
      "UPDATE CATEGORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update category.",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================================================
// DELETE CATEGORY
// =========================================================

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    if (
      !id ||
      typeof id !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Category ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------------------
    // GET BUSINESS ID
    // -----------------------------------------------------

    const url =
      new URL(request.url);

    const businessId =
      url.searchParams.get(
        "businessId"
      );

    if (!businessId) {
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
    // FIND CATEGORY
    // -----------------------------------------------------

    const category =
      await prisma.category.findFirst({
        where: {
          id,
          businessId,
        },

        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

    if (!category) {
      return NextResponse.json(
        {
          error:
            "Category not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------------------------------
    // DON'T DELETE CATEGORY
    // IF PRODUCTS EXIST
    // -----------------------------------------------------

    if (
      category._count.products > 0
    ) {
      return NextResponse.json(
        {
          error:
            `This category contains ${category._count.products} product${category._count.products === 1 ? "" : "s"}. Move or delete those products before deleting the category.`,
        },
        {
          status: 409,
        }
      );
    }

    // -----------------------------------------------------
    // DELETE
    // -----------------------------------------------------

    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });

    return NextResponse.json({
      success: true,

      message:
        "Category deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE CATEGORY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete category.",
      },
      {
        status: 500,
      }
    );
  }
}