import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MarriageApprovalCard from "@/components/admin/MarriageApprovalCard";

export default async function AdminMarriagePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  const assignments = await prisma.committeeAssignment.findMany({ where: { userId: user.id } });
  const approverDesig = ["PRESIDENT", "SECRETARY"];

  // VIEW rights: any committee membership grants viewing.
  // - Any TALUKA committee member (any designation/type) can view their taluka's applications.
  // - Any CENTRAL committee member (any designation/type) can view all applications.
  const talukaViewTalukas = assignments
    .filter((a) => a.level === "TALUKA")
    .map((a) => a.taluka)
    .filter(Boolean) as string[];
  const isCentralMember = assignments.some((a) => a.level === "CENTRAL");

  // APPROVE rights: only President/Secretary.
  const talukaApproverTalukas = assignments
    .filter((a) => a.level === "TALUKA" && approverDesig.includes(a.designation))
    .map((a) => a.taluka)
    .filter(Boolean) as string[];
  const isCentralApprover = assignments.some((a) => a.level === "CENTRAL" && approverDesig.includes(a.designation));

  // Which applications this user can SEE
  let where: any = {};
  if (isSuperAdmin || isCentralMember) {
    where = {}; // all
  } else if (talukaViewTalukas.length > 0) {
    where = { taluka: { in: talukaViewTalukas } };
  } else {
    where = { id: "none" }; // no committee role → nothing
  }

  const applications = await prisma.marriagePermission.findMany({
    where,
    include: {
      submittedBy: {
        select: {
          email: true,
          profilePictureUrl: true,
          familyUnit: { select: { familyName: true, taluka: true, villageTown: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">Marriage Permissions</h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Review and approve marriage & negotiation applications.
      </p>

      {applications.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[36px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)]">No applications to review.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {applications.map((app) => (
            <MarriageApprovalCard
              key={app.id}
              id={app.id}
              groomName={app.groomName}
              brideName={app.brideName}
              taluka={app.taluka || "—"}
              marriageDate={app.marriageDate || "—"}
              submitterName={app.submittedBy?.familyUnit?.familyName || app.submittedBy?.email || "Unknown"}
              submitterTaluka={app.submittedBy?.familyUnit?.taluka || ""}
              submitterVillage={app.submittedBy?.familyUnit?.villageTown || ""}
              submitterProfilePictureUrl={app.submittedBy?.profilePictureUrl}
              status={app.status}
              rejectionReason={app.rejectionReason}
              talukaApproved={app.talukaApproved}
              centralApproved={app.centralApproved}
              adminApproved={app.adminApproved}
              talukaApprovedBy={app.talukaApprovedBy}
              centralApprovedBy={app.centralApprovedBy}
              adminApprovedBy={app.adminApprovedBy}
              canApproveTaluka={talukaApproverTalukas.includes(app.taluka || "")}
              canApproveCentral={isCentralApprover}
              canApproveAdmin={isSuperAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
