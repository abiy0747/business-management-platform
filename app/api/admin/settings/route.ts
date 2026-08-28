import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        business: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      settings: admin.business,
      adminName: admin.name,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      name,
      address,
      phone,
      telegram,
      instagram,
      openingHours,
      description,
      logoUrl,
      aboutImageUrl,
      promoImageUrl,
      categoryImageUrl,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      );
    }

    const updatedBusiness = await prisma.business.update({
      where: {
        id: admin.businessId,
      },

      data: {
        name: name.trim(),

        address: address?.trim() || null,

        phone: phone?.trim() || null,

        telegram: telegram?.trim() || null,

        instagram: instagram?.trim() || null,

        openingHours:
          openingHours?.trim() || null,

        description:
          description?.trim() || null,

        logoUrl:
          logoUrl?.trim() || null,

        aboutImageUrl:
          aboutImageUrl?.trim() || null,

        promoImageUrl:
          promoImageUrl?.trim() || null,

        categoryImageUrl:
          categoryImageUrl?.trim() || null,
      },
    });

    // Refresh customer-facing cached pages (catalog,
    // categories, about) and any cached admin data.
    revalidateTag("catalog", "max");
    revalidateTag("admin", "max");

    return NextResponse.json({
      success: true,
      settings: updatedBusiness,
      adminName: admin.name,
    });
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}