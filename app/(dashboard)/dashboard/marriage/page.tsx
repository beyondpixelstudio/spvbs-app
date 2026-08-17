import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PendingLock from "@/components/PendingLock";

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "#8a6d1a", bg: "#ffc03920" },
  APPROVED: { label: "Approved", color: "#0e7a3d", bg: "#18b76020" },
  REJECTED: { label: "Rejected", color: "#a11f4a", bg: "#cc336620" },
};

function Tick({ label, done, by }: { label: string; done: boolean; by?: string | null }) {
  return (
    <div className="flex items-start gap-[6px]">
      <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] shrink-0 mt-[1px] ${done ? "bg-[var(--color-extra-green)] text-white" : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"}`}>
        {done ? "✓" : ""}
      </span>
      <div className="flex flex-col">
        <span className={`text-[13px] ${done ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}`}>{label}</span>
        {done && by && <span className="text-[11px] text-[var(--color-text-secondary)] leading-tight">by {by}</span>}
      </div>
    </div>
  );
}

export default async function MyMarriagePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.status === "PENDING") {
    return (
      <div>
        <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
          Marriage & Negotiation
        </h2>
        <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
          Submit marriage and negotiation applications.
        </p>
        <PendingLock feature="Marriage & Negotiation" />
      </div>
    );
  }

  const apps = await prisma.marriagePermission.findMany({
    where: { submittedByUserId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-[16px] mb-[6px] flex-wrap">
        <h2 className="!text-[32px] text-[var(--color-bg-secondary)]">My Marriage Applications</h2>
        <Link href="/permission/marriage" className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-medium rounded-[40px] px-[22px] py-[10px] text-[15px] hover:opacity-90">
          + New Application
        </Link>
      </div>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Track the approval status of your marriage & negotiation applications.
      </p>

      {apps.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[36px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)] mb-[16px]">You haven&apos;t submitted any applications yet.</p>
          <Link href="/permission/marriage" className="text-[var(--color-primary)] font-medium hover:opacity-80">Submit one →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {apps.map((a) => {
            const badge = statusBadge[a.status] ?? statusBadge.PENDING;
            return (
              <div key={a.id} className="bg-white rounded-[20px] border border-[#ece5d5] p-[24px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
                <div className="flex items-start justify-between gap-[14px] flex-wrap">
                  <div>
                    <h4 className="!text-[19px] text-[var(--color-bg-secondary)]">
                      {a.groomName} <span className="text-[var(--color-secondary)]">×</span> {a.brideName}
                    </h4>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
                      Taluka: {a.taluka || "—"} • Date: {a.marriageDate || "—"}
                    </p>
                  </div>
                  <span className="text-[12px] font-medium px-[12px] py-[5px] rounded-[40px]" style={{ color: badge.color, background: badge.bg }}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-[18px] mt-[16px] pt-[16px] border-t border-[#f0eadd]">
                  <Tick label="Taluka Committee" done={a.talukaApproved} by={a.talukaApprovedBy} />
                  <Tick label="Central Committee" done={a.centralApproved} by={a.centralApprovedBy} />
                  <Tick label="Admin" done={a.adminApproved} by={a.adminApprovedBy} />
                </div>

                {a.status === "REJECTED" && a.rejectionReason && (
                  <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px] mt-[14px]">
                    Rejected: {a.rejectionReason}
                  </p>
                )}
                {a.status === "APPROVED" && (
                  <p className="text-[14px] text-[#0e7a3d] bg-[#18b76015] rounded-[12px] px-[14px] py-[10px] mt-[14px]">
                    ✓ Fully approved by all levels.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
