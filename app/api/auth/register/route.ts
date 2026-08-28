import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";

// =========================================================
// SELLER REGISTRATION
// POST /api/auth/register
//
// Creates a new Business + Admin (same seller) in a single
// atomic transaction. The slug is generated server-side and
// guaranteed unique. The client signs the seller in through
// the existing credentials flow afterwards.
// =========================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
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
      !name.trim()
    ) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
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
      !storeName.trim()
    ) {
      return NextResponse.json(
        { error: "Store name is required." },
        { status: 400 }
      );
    }

    if (storeName.trim().length < 2) {
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

    const business = await prisma.business.create({
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
      { error: "Failed to create account." },
      { status: 500 }
    );
  }
}