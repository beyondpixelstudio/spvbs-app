import { prisma } from "@/lib/prisma";
import CommitteeDisplay from "@/components/committee/CommitteeDisplay";

const levelLabel: Record<string, string> = { TALUKA: "Taluka", CENTRAL: "Central" };
const typeLabel: Record<string, string> = {
  ADVISOR: "Advisor",
  CORE: "Core Committee",
  FINANCE: "Finance",
  MANDIR_PARICHALANA: "Mandir Parichalana",
  YOUTH_CELL: "Youth Cell",
};
const designationLabel: Record<string, string> = {
  PRESIDENT: "President",
  SECRETARY: "Secretary",
  JOINT_SECRETARY: "Joint Secretary",
  CASHIER: "Cashier",
  MEMBER: "Member",
};
const designationOrder: Record<string, number> = {
  PRESIDENT: 1, SECRETARY: 2, JOINT_SECRETARY: 3, CASHIER: 4, MEMBER: 5,
};

export default async function TalukaCommitteePage() {
  const assignments = await prisma.committeeAssignment.findMany({
    where: { level: "TALUKA" },
    include: {
      user: {
        select: {
          phone: true,
          email: true,
          profilePictureUrl: true,
          familyUnit: {
            select: {
              familyName: true,
              taluka: true,
              villageTown: true,
              members: { where: { relation: "Head" }, select: { mobileNumber: true }, take: 1 },
            },
          },
        },
      },
    },
  });

  const members = assignments
    .map((a) => ({
      id: a.id,
      name: a.user.familyUnit?.familyName || a.user.email || "Unknown",
      level: a.level,
      levelText: levelLabel[a.level] || a.level,
      type: a.type,
      typeText: typeLabel[a.type] || a.type,
      designation: a.designation,
      designationText: designationLabel[a.designation] || a.designation,
      taluka: a.taluka || a.user.familyUnit?.taluka || "",
      village: a.user.familyUnit?.villageTown || "",
      phone: a.user.familyUnit?.members?.[0]?.mobileNumber || a.user.phone || "",
      profilePictureUrl: a.user.profilePictureUrl || "",
      order: designationOrder[a.designation] || 99,
    }))
    .sort((x, y) => x.order - y.order);

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="bg-[var(--color-bg-secondary)] py-[50px] px-[20px]">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="!text-[42px] !text-white font-[family-name:var(--font-heading)]">Taluka Committee</h1>
          <p className="text-[17px] text-[#cedbf5] mt-[8px]">
            The dedicated members serving our samaj across all talukas.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-[20px] py-[40px]">
        <CommitteeDisplay members={members} typeOptions={Object.entries(typeLabel).map(([value, label]) => ({ value, label }))} level="TALUKA" />
      </div>
    </div>
  );
}
