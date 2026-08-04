import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GrievanceForm from "@/components/grievance/GrievanceForm";
import MemberGrievanceCard from "@/components/grievance/MemberGrievanceCard";

export default async function GrievancePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const family = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: { members: { where: { relation: "Head" }, take: 1 } },
  });
  const headMemberId = family?.members[0]?.id;

  const myGrievances = headMemberId
    ? await prisma.grievance.findMany({
        where: { submittedByMemberId: headMemberId },
        include: { comments: { orderBy: { createdAt: "asc" } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        Grievances
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Raise concerns and track their resolution.
      </p>

      <div className="flex flex-col gap-[30px]">
        <GrievanceForm />

        <div>
          <div className="flex items-center gap-[12px] mb-[18px]">
            <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
              My Grievances ({myGrievances.length})
            </span>
            <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
          </div>

          {myGrievances.length === 0 ? (
            <p className="text-[15px] text-[var(--color-text-secondary)]">
              You haven&apos;t raised any grievances yet. (Anonymous ones won&apos;t appear here.)
            </p>
          ) : (
            <div className="flex flex-col gap-[16px]">
              {myGrievances.map((g) => (
                <MemberGrievanceCard
                  key={g.id}
                  id={g.id}
                  subject={g.subject}
                  description={g.description}
                  category={g.category}
                  againstWhom={g.againstWhom}
                  status={g.status}
                  adminNotes={g.adminNotes}
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
      </div>
    </div>
  );
}
