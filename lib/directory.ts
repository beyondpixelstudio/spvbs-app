import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Visibility } from "@prisma/client";

// Which member visibilities a viewer is allowed to see
async function allowedVisibilities(): Promise<Visibility[]> {
  const user = await getCurrentUser();
  if (user) {
    // Logged-in members can see public + members-only
    return ["PUBLIC", "MEMBERS_ONLY"];
  }
  // Public visitors: only public
  return ["PUBLIC"];
}

// Fetch approved families with their visible members (for the directory list)
export async function getDirectoryFamilies(opts?: {
  search?: string;
  taluka?: string;
}) {
  const visibilities = await allowedVisibilities();

  const families = await prisma.familyUnit.findMany({
    where: {
      familyHeadUser: { status: "APPROVED" },
      ...(opts?.taluka ? { taluka: opts.taluka } : {}),
      ...(opts?.search
        ? {
            OR: [
              { familyName: { contains: opts.search, mode: "insensitive" } },
              { villageTown: { contains: opts.search, mode: "insensitive" } },
              {
                members: {
                  some: {
                    fullName: { contains: opts.search, mode: "insensitive" },
                    visibility: { in: visibilities },
                  },
                },
              },
            ],
          }
        : {}),
    },
    include: {
      familyHeadUser: { select: { profilePictureUrl: true } },
      members: {
        where: { visibility: { in: visibilities } },
        orderBy: { relation: "asc" },
      },
    },
    orderBy: { familyName: "asc" },
  });

  // Only return families that have at least one visible member
  return families.filter((f) => f.members.length > 0);
}

// Fetch a single family's public profile (respecting visibility)
export async function getFamilyProfile(familyId: string) {
  const visibilities = await allowedVisibilities();
  const viewer = await getCurrentUser();

  const family = await prisma.familyUnit.findFirst({
    where: {
      id: familyId,
      familyHeadUser: { status: "APPROVED" },
    },
    include: {
      familyHeadUser: { select: { profilePictureUrl: true } },
      members: {
        where: { visibility: { in: visibilities } },
        include: {
          _count: { select: { privateDocuments: true } },
        },
      },
    },
  });

  if (!family) return family;

  const isOwner = viewer && family.familyHeadUserId === viewer.id;

  let grantedMemberIds = new Set<string>();
  if (viewer && !isOwner) {
    const grants = await prisma.documentAccessGrant.findMany({
      where: { grantedToUserId: viewer.id, familyMemberId: { in: family.members.map((m) => m.id) } },
      select: { familyMemberId: true },
    });
    grantedMemberIds = new Set(grants.map((g) => g.familyMemberId));
  }

  return {
    ...family,
    members: family.members.map((m) => ({
      ...m,
      hasDocAccess: !!isOwner || grantedMemberIds.has(m.id),
    })),
  };
}

// Distinct taluka list for the filter dropdown
export async function getTalukas(): Promise<string[]> {
  const rows = await prisma.familyUnit.findMany({
    where: { familyHeadUser: { status: "APPROVED" } },
    select: { taluka: true },
    distinct: ["taluka"],
    orderBy: { taluka: "asc" },
  });
  return rows.map((r) => r.taluka).filter(Boolean);
}
