import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverview() {
  // Gather counts in parallel
  const [
    totalFamilies,
    pendingCount,
    approvedCount,
    totalMembers,
    openGrievances,
  ] = await Promise.all([
    prisma.familyUnit.count(),
    prisma.user.count({ where: { role: "FAMILY_HEAD", status: "PENDING" } }),
    prisma.user.count({ where: { role: "FAMILY_HEAD", status: "APPROVED" } }),
    prisma.familyMember.count(),
    prisma.grievance.count({ where: { status: "OPEN" } }),
  ]);

  const stats = [
    { label: "Total Families", value: totalFamilies, href: "/admin/members", color: "var(--color-primary)" },
    { label: "Pending Approvals", value: pendingCount, href: "/admin/approvals", color: "var(--color-extra-yellow)" },
    { label: "Approved Members", value: approvedCount, href: "/admin/members", color: "var(--color-extra-green)" },
    { label: "Total People Listed", value: totalMembers, href: "/admin/members", color: "var(--color-bg-secondary)" },
  ];

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        Admin Overview
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        A snapshot of your community at a glance.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[30px]">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-[24px] border border-[var(--color-border)] p-[26px] transition-all hover:-translate-y-[3px]"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <div
              className="text-[40px] font-[family-name:var(--font-heading)]"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-[15px] text-[var(--color-text-secondary)] mt-[4px]">
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Action highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Pending approvals callout */}
        <div
          className="rounded-[24px] p-[30px]"
          style={{
            background:
              pendingCount > 0 ? "var(--color-bg-secondary)" : "var(--color-border)",
          }}
        >
          {pendingCount > 0 ? (
            <>
              <h4 className="!text-[20px] !text-white mb-[8px]">
                {pendingCount} {pendingCount === 1 ? "family is" : "families are"} waiting
              </h4>
              <p className="text-[15px] text-[#cedbf5] mb-[20px]">
                Review and approve new registrations to add them to the directory.
              </p>
              <Link
                href="/admin/approvals"
                className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-medium rounded-[40px] px-[24px] py-[12px] text-[16px] hover:opacity-90"
              >
                Review approvals →
              </Link>
            </>
          ) : (
            <>
              <h4 className="!text-[20px] text-[var(--color-bg-secondary)] mb-[8px]">
                All caught up ✓
              </h4>
              <p className="text-[15px] text-[var(--color-text)]">
                No pending approvals right now.
              </p>
            </>
          )}
        </div>

        {/* Grievances callout */}
        <div
          className="rounded-[24px] p-[30px] bg-white border border-[var(--color-border)]"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          <h4 className="!text-[20px] text-[var(--color-bg-secondary)] mb-[8px]">
            Open Grievances
          </h4>
          <p className="text-[15px] text-[var(--color-text)] mb-[20px]">
            {openGrievances > 0
              ? `${openGrievances} ${openGrievances === 1 ? "grievance needs" : "grievances need"} attention.`
              : "No open grievances."}
          </p>
          <Link
            href="/admin/grievances"
            className="inline-flex items-center justify-center border border-[var(--color-primary)] text-[var(--color-primary)] font-medium rounded-[40px] px-[24px] py-[12px] text-[16px] hover:bg-[var(--color-primary)] hover:text-white transition-all"
          >
            View grievances
          </Link>
        </div>
      </div>
    </div>
  );
}
