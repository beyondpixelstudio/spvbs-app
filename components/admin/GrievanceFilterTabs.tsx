"use client";

import Link from "next/link";

const tabs = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
];

export default function GrievanceFilterTabs({ current }: { current: string }) {
  return (
    <div className="flex gap-[8px] overflow-x-auto">
      {tabs.map((t) => {
        const active = current === t.value;
        const href =
          t.value === "ALL"
            ? "/admin/grievances"
            : `/admin/grievances?status=${t.value}`;
        return (
          <Link
            key={t.value}
            href={href}
            className={`px-[18px] py-[9px] rounded-[40px] text-[15px] font-medium whitespace-nowrap transition-all ${
              active
                ? "bg-[var(--color-bg-secondary)] text-white"
                : "bg-white border border-[#ece5d5] text-[var(--color-text)] hover:border-[var(--color-primary)]"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
