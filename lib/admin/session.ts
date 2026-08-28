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