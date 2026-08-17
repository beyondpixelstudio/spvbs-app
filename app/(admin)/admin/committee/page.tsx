import { prisma } from "@/lib/prisma";
import CommitteeAssignForm from "@/components/admin/CommitteeAssignForm";
import CommitteeMemberRow from "@/components/admin/CommitteeMemberRow";

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

export default async function AdminCommitteePage() {
  const heads = await prisma.user.findMany({
    where: { role: "FAMILY_HEAD", status: "APPROVED" },
    include: { familyUnit: { select: { familyName: true, taluka: true } } },
    orderBy: { createdAt: "desc" },
  });

  const candidates = heads
    .filter((h) => h.familyUnit)
    .map((h) => ({
      userId: h.id,
      name: h.familyUnit!.familyName,
      taluka: h.familyUnit!.taluka || "",
      email: h.email || "",
      profilePictureUrl: h.profilePictureUrl || "",
    }));

  const assignments = await prisma.committeeAssignment.findMany({
    include: {
      user: { include: { familyUnit: { select: { familyName: true, taluka: true } } } },
    },
    orderBy: [{ level: "asc" }, { type: "asc" }],
  });

  const rows = assignments.map((a) => ({
    id: a.id,
    name: a.user.familyUnit?.familyName || a.user.email || "Unknown",
    level: levelLabel[a.level] || a.level,
    type: typeLabel[a.type] || a.type,
    designation: designationLabel[a.designation] || a.designation,
    taluka: a.taluka || a.user.familyUnit?.taluka || "",
    profilePictureUrl: a.user.profilePictureUrl || "",
  }));

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">Committee</h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Assign approved family heads to taluka or central committees.
      </p>

      <CommitteeAssignForm candidates={candidates} />

      <div className="mt-[36px]">
        <div className="flex items-center gap-[12px] mb-[18px]">
          <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
            Current Committee ({rows.length})
          </span>
          <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
        </div>

        {rows.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[30px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
            <p className="text-[16px] text-[var(--color-text)]">No committee members assigned yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {rows.map((r) => (
              <CommitteeMemberRow key={r.id} {...r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
