import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Returns the logged-in family head's UNMARRIED sons or daughters.
// ?relation=Son or ?relation=Daughter
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const relation = req.nextUrl.searchParams.get("relation") || "";
  if (!["Son", "Daughter"].includes(relation)) {
    return NextResponse.json({ children: [] });
  }

  const family = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: {
      members: {
        where: {
          relation: { in: relation === "Son" ? ["Son", "Grandson"] : ["Daughter", "Granddaughter"] },
          OR: [{ maritalStatus: "UNMARRIED" }, { maritalStatus: null }],
        },
      },
    },
  });

  const headMember = family
    ? await prisma.familyMember.findFirst({
        where: { familyUnitId: family.id, relation: "Head" },
      })
    : null;

  const children = (family?.members || []).map((m) => {
    const ageNum = m.dob ? Math.floor((Date.now() - new Date(m.dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : null;
    return {
      id: m.id,
      name: m.fullName,
      age: ageNum !== null ? String(ageNum) : "",
      eligible: ageNum === null ? true : ageNum >= 18,
      education: m.qualification || "",
      village: m.villageTown || family?.villageTown || "",
      father: headMember?.fullName || "",
      fatherPhone: headMember?.mobileNumber || "",
      fatherVillage: headMember?.villageTown || family?.villageTown || "",
    };
  });

  return NextResponse.json({ children });
}
