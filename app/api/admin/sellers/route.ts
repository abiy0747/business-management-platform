import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { adminTag } from "@/lib/admin/data";

// =========================================================
// PLATFORM OWNER — CREATE SELLER
// POST /api/admin/sellers
//
// Creates a new Business + Admin (a seller) in a single
// atomic transaction. Only the platform owner (an Admin with
// isOwner = true) may create sellers. The slug is generated
// server-side and guaranteed unique. Passwords are hashed with
// the same bcrypt implementation used by the rest of the app,
// and the Admin is connected to the Business via businessId.
// =========================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    // -----------------------------------------------------
    // OWNER AUTHORIZATION
    // -----------------------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const owner = await prisma.admin.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        isOwner: true,
      },
    });

    if (!owner || !owner.isOwner) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // -----------------------------------------------------
    // PARSE BODY
    // -----------------------------------------------------

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      storeName,
    } = body;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length < 2
    ) {
      return NextResponse.json(
        {
          error:
            "Full name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (
      typeof email !== "string" ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return NextResponse.json(
        {
          error:
            "Password must include both letters and numbers.",
        },
        { status: 400 }
      );
    }

    if (
      typeof storeName !== "string" ||
      !storeName.trim() ||
      storeName.trim().length < 2
    ) {
      return NextResponse.json(
        {
          error:
            "Store name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // UNIQUE EMAIL
    // -----------------------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------------------
    // UNIQUE SLUG
    // -----------------------------------------------------

    const slug = await generateUniqueSlug(storeName.trim());

    // -----------------------------------------------------
    // CREATE BUSINESS + ADMIN
    // -----------------------------------------------------

    const passwordHash = await bcrypt.hash(password, 12);

    const business = await prisma.$transaction(async (tx) => {
      const created = await tx.business.create({
        data: {
          name: storeName.trim(),
          slug,
          admins: {
            create: {
              name: name.trim(),
              email: normalizedEmail,
              passwordHash,
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      return created;
    });

    // Refresh the admin seller list cache after creating a seller.
    revalidateTag(adminTag, "max");

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        business,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE SELLER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create seller." },
      { status: 500 }
    );
  }
}
