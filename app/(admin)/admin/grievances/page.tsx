import { prisma } from "@/lib/prisma";
import GrievanceResolveCard from "@/components/admin/GrievanceResolveCard";
import GrievanceFilterTabs from "@/components/admin/GrievanceFilterTabs";

const categoryLabels: Record<string, string> = {
  COMMITTEE: "Against Committee/Admin",
  MEMBER: "Against a Member",
  EVENT: "Event / Function",
  FINANCIAL: "Financial / Donation",
  SUGGESTION: "Suggestion / Feedback",
  OTHER: "Other",
};

export default async function AdminGrievancesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const [grievances, open, inProgress, resolved] = await Promise.all([
    prisma.grievance.findMany({
      where: status && status !== "ALL" ? { status: status as any } : {},
      include: {
        submittedByMember: {
          select: {
            fullName: true,
            familyUnit: { select: { familyName: true } },
          },
        },
        comments: { orderBy: { createdAt: "asc" } },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
    prisma.grievance.count({ where: { status: "OPEN" } }),
    prisma.grievance.count({ where: { status: "IN_PROGRESS" } }),
    prisma.grievance.count({ where: { status: "RESOLVED" } }),
  ]);

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        Grievances
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[24px]">
        Review and resolve community grievances and suggestions.
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-[14px] mb-[24px]">
        <div className="bg-white rounded-[18px] border border-[#ece5d5] px-[18px] py-[16px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
          <div className="text-[26px] font-[family-name:var(--font-heading)] text-[#8a6d1a]">{open}</div>
          <div className="text-[13px] text-[var(--color-text-secondary)]">Open</div>
        </div>
        <div className="bg-white rounded-[18px] border border-[#ece5d5] px-[18px] py-[16px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
          <div className="text-[26px] font-[family-name:var(--font-heading)] text-[#1a5a8a]">{inProgress}</div>
          <div className="text-[13px] text-[var(--color-text-secondary)]">In Progress</div>
        </div>
        <div className="bg-white rounded-[18px] border border-[#ece5d5] px-[18px] py-[16px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
          <div className="text-[26px] font-[family-name:var(--font-heading)] text-[#0e7a3d]">{resolved}</div>
          <div className="text-[13px] text-[var(--color-text-secondary)]">Resolved</div>
        </div>
      </div>

      {/* Filter tabs */}
      <GrievanceFilterTabs current={status || "ALL"} />

      <p className="text-[14px] tracking-[1px] uppercase text-[var(--color-text-secondary)] my-[20px]">
        {grievances.length} {grievances.length === 1 ? "Grievance" : "Grievances"}
      </p>

      {grievances.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[36px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)]">No grievances here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {grievances.map((g) => (
            <GrievanceResolveCard
              key={g.id}
              id={g.id}
              subject={g.subject}
              description={g.description}
              category={categoryLabels[g.category] || g.category}
              againstWhom={g.againstWhom}
              status={g.status}
              adminNotes={g.adminNotes}
              submitterName={
                g.submittedByMember
                  ? `${g.submittedByMember.fullName}${g.submittedByMember.familyUnit ? ` (${g.submittedByMember.familyUnit.familyName})` : ""}`
                  : "Anonymous"
              }
              createdAt={g.createdAt.toISOString()}
              comments={g.comments.map((c) => ({
                id: c.id,
                authorRole: c.authorRole,
                body: c.body,
                attachmentUrl: c.attachmentUrl,
                createdAt: c.createdAt.toISOString(),
              }))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
