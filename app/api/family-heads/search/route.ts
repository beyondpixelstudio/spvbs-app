import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ results: [] }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() || "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const families = await prisma.familyUnit.findMany({
    where: {
      familyHeadUserId: { not: user.id },
      familyHeadUser: { status: "APPROVED" },
      familyName: { contains: q, mode: "insensitive" },
    },
    select: {
      familyHeadUserId: true,
      familyName: true,
      taluka: true,
      familyHeadUser: { select: { profilePictureUrl: true } },
    },
    take: 8,
    orderBy: { familyName: "asc" },
  });

  const results = families.map((f) => ({
    userId: f.familyHeadUserId,
    name: f.familyName,
    taluka: f.taluka,
    profilePictureUrl: f.familyHeadUser?.profilePictureUrl || null,
  }));

  return NextResponse.json({ results });
}
