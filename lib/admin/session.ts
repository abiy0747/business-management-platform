import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// =========================================================
// SESSION-DERIVED BUSINESS
//
// Every admin API route and admin page derives the business
// from the authenticated session (admin record), never from
// a businessId supplied by the client. This guarantees each
// seller can only ever read / write their own data.
// =========================================================

export type AdminSessionBusiness = {
  businessId: string;
  businessName: string;
  slug: string | null;
  isOwner: boolean;
};

export async function getAdminSessionBusiness(): Promise<AdminSessionBusiness | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      businessId: true,
      isOwner: true,
      business: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!admin) {
    return null;
  }

  return {
    businessId: admin.businessId,
    businessName: admin.business.name,
    slug: admin.business.slug,
    isOwner: admin.isOwner,
  };
}

// For server components (admin pages). Redirects unauthenticated
// users to the login page instead of returning null.
export async function requireAdminSession(): Promise<AdminSessionBusiness> {
  const session = await getAdminSessionBusiness();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

// For platform-owner-only server components (admin pages).
// Redirects unauthenticated users to the login page and any
// signed-in non-owner away from the owner-only area.
export async function requireOwnerSession(): Promise<AdminSessionBusiness> {
  const session = await requireAdminSession();

  if (!session.isOwner) {
    redirect("/admin/dashboard");
  }

  return session;
}