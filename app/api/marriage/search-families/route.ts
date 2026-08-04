import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Search APPROVED family heads (excluding self) by family name / taluka / village.
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 1) return NextResponse.json({ families: [] });

  const families = await prisma.familyUnit.findMany({
    where: {
      familyHeadUserId: { not: user.id },
      familyHeadUser: { status: "APPROVED" },
      OR: [
        { familyName: { contains: q, mode: "insensitive" } },
        { taluka: { contains: q, mode: "insensitive" } },
        { villageTown: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, familyName: true, taluka: true, villageTown: true },
    take: 8,
  });

  return NextResponse.json({ families });
}
