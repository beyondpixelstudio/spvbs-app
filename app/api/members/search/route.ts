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

  const members = await prisma.familyMember.findMany({
    where: {
      fullName: { contains: q, mode: "insensitive" },
      familyUnit: { familyHeadUser: { status: "APPROVED" } },
    },
    select: {
      id: true,
      fullName: true,
      relation: true,
      villageTown: true,
      familyUnit: { select: { villageTown: true, taluka: true, familyHeadUser: { select: { profilePictureUrl: true } } } },
    },
    take: 8,
    orderBy: { fullName: "asc" },
  });

  const results = members.map((m) => ({
    id: m.id,
    name: m.fullName,
    relation: m.relation,
    location:
      m.villageTown || m.familyUnit?.villageTown
        ? `${m.villageTown || m.familyUnit?.villageTown}, ${m.familyUnit?.taluka || ""}`.replace(/, $/, "")
        : m.familyUnit?.taluka || "",
    profilePictureUrl: m.relation === "Head" ? m.familyUnit?.familyHeadUser?.profilePictureUrl || null : null,
  }));

  return NextResponse.json({ results });
}
