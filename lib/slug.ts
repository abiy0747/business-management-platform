import { prisma } from "@/lib/prisma";

// =========================================================
// SLUG UTILITIES
//
// Every business gets a unique, human-readable slug used
// for its public catalog URL: `/store/<slug>`.
// =========================================================

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 60);

  return slug || "store";
}

// Returns a slug that is guaranteed to be unique among all
// businesses. Examples:
//   "Abebe Mobile"  ->  "abebe-mobile"
//   "Abebe Mobile"  ->  "abebe-mobile-2" (if taken)
//   "Abebe Mobile"  ->  "abebe-mobile-3" (if taken)
export async function generateUniqueSlug(
  storeName: string
): Promise<string> {
  const base = slugify(storeName);

  let candidate = base;
  let suffix = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.business.findUnique({
      where: {
        slug: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}