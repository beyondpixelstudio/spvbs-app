import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MarriageApprovalCard from "@/components/admin/MarriageApprovalCard";
import EventsManager from "@/components/events/EventsManager";
import Link from "next/link";

const levelText: Record<string, string> = { TALUKA: "Taluka", CENTRAL: "Central" };
const typeText: Record<string, string> = {
  ADVISOR: "Advisor", CORE: "Core Committee", FINANCE: "Finance",
  MANDIR_PARICHALANA: "Mandir Parichalana", YOUTH_CELL: "Youth Cell",
};
const desigText: Record<string, string> = {
  PRESIDENT: "President", SECRETARY: "Secretary", JOINT_SECRETARY: "Joint Secretary",
  CASHIER: "Cashier", MEMBER: "Member",
};

export default async function CommitteeTasksPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const assignments = await prisma.committeeAssignment.findMany({ where: { userId: user.id } });

  // No committee role → nothing here
  if (assignments.length === 0) {
    return (
      <div>
        <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">Committee Tasks</h2>
        <p className="text-[16px] text-[var(--color-text-secondary)]">You are not part of any committee.</p>
      </div>
    );
  }

  const approverDesig = ["PRESIDENT", "SECRETARY"];

  // VIEW scope
  const talukaViewTalukas = assignments.filter((a) => a.level === "TALUKA").map((a) => a.taluka).filter(Boolean) as string[];
  const isCentralMember = assignments.some((a) => a.level === "CENTRAL");

  // APPROVE scope
  const talukaApproverTalukas = assignments.filter((a) => a.level === "TALUKA" && approverDesig.includes(a.designation)).map((a) => a.taluka).filter(Boolean) as string[];
  const isCentralApprover = assignments.some((a) => a.level === "CENTRAL" && approverDesig.includes(a.designation));

  // Which marriage applications this user can see
  let where: any = {};
  if (isCentralMember) {
    where = {};
  } else if (talukaViewTalukas.length > 0) {
    where = { taluka: { in: talukaViewTalukas } };
  } else {
    where = { id: "none" };
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

  // Events: managed by Advisor/Core President/Secretary (taluka or central)
  const canManageEvents = assignments.some(
    (a) => ["ADVISOR", "CORE"].includes(a.type) && ["PRESIDENT", "SECRETARY"].includes(a.designation)
  );
  const rawEvents = canManageEvents
    ? await prisma.event.findMany({
        orderBy: { dateTime: "desc" },
      })
    : [];
  const events = rawEvents.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    dateTime: e.dateTime.toISOString(),
    location: e.location,
    taluka: e.taluka,
  }));

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">Committee Tasks</h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[24px]">
        Review requests for the committees you serve on.
      </p>

      {/* Your roles */}
      <div className="bg-[var(--color-bg-secondary)] rounded-[20px] p-[22px] mb-[30px]">
        <div className="text-[12px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium mb-[12px]">
          Your Committee Role{assignments.length > 1 ? "s" : ""}
        </div>
        <div className="flex flex-wrap gap-[10px]">
          {assignments.map((c) => (
            <div key={c.id} className="bg-white/10 rounded-[14px] px-[16px] py-[10px]">
              <div className="text-[15px] font-medium text-white">{desigText[c.designation] || c.designation}</div>
              <div className="text-[13px] text-[#cedbf5]">
                {levelText[c.level] || c.level} • {typeText[c.type] || c.type}{c.taluka ? ` • ${c.taluka}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marriage applications */}
      <div className="flex items-center gap-[12px] mb-[18px]">
        <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
          Marriage & Negotiation ({applications.length})
        </span>
        <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[36px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)]">No marriage applications to review right now.</p>
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
              canApproveAdmin={false}
            />
          ))}
        </div>
      )}

      {/* Events management (only for events-capable committee members) */}
      {canManageEvents && (
        <div className="mt-[40px]">
          <div className="flex items-center gap-[12px] mb-[18px]">
            <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
              Events
            </span>
            <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
          </div>
          <EventsManager events={events} />
        </div>
      )}
    </div>
  );
}
