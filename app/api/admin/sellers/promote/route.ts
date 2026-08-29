import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { adminTag } from "@/lib/admin/data";

// =========================================================
// PLATFORM OWNER — PROMOTE SELLER BY EMAIL
// POST /api/admin/sellers/promote
//
// Sets an existing seller (identified by email) as the
// platform owner (isOwner = true). Only a currently-authenticated
// platform owner may perform this action, and they must confirm
// with their own admin password.
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
        email: true,
        passwordHash: true,
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

    const { email, password } = body;

    if (
      typeof email !== "string" ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return NextResponse.json(
        { error: "Enter a valid seller email." },
        { status: 400 }
      );
    }

    if (
      typeof password !== "string" ||
      password.length === 0
    ) {
      return NextResponse.json(
        { error: "Your password is required to confirm." },
        { status: 400 }
      );
    }

    // -----------------------------------------------------
    // CONFIRM THE OWNER'S PASSWORD
    // -----------------------------------------------------

    const passwordValid = await bcrypt.compare(
      password,
      owner.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    // -----------------------------------------------------
    // FIND TARGET SELLER
    // -----------------------------------------------------

    const normalizedEmail = email.trim().toLowerCase();

    const target = await prisma.admin.findUnique({
      where: {
        email: normalizedEmail,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isOwner: true,
      },
    });

    if (!target) {
      return NextResponse.json(
        { error: "No seller found with that email." },
        { status: 404 }
      );
    }

    if (target.isOwner) {
      return NextResponse.json(
        {
          error:
            "This account is already the platform owner.",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------------------
    // PROMOTE
    // -----------------------------------------------------

    const updated = await prisma.admin.update({
      where: {
        id: target.id,
      },
      data: {
        isOwner: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isOwner: true,
      },
    });

    // Refresh the admin seller list cache.
    revalidateTag(adminTag, "max");

    return NextResponse.json({
      success: true,
      seller: updated,
    });
  } catch (error) {
    console.error("PROMOTE SELLER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to promote seller." },
      { status: 500 }
    );
  }
}
