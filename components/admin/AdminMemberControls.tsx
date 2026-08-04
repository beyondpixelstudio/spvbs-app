"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "SUSPENDED", label: "Suspended" },
];

export default function AdminMemberControls({
  initialQ,
  initialStatus,
  initialTaluka,
  talukas,
}: {
  initialQ: string;
  initialStatus: string;
  initialTaluka: string;
  talukas: string[];
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);
  const [taluka, setTaluka] = useState(initialTaluka);
  const isFirst = useRef(true);

  function buildUrl(newQ: string, newStatus: string, newTaluka: string) {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    if (newStatus && newStatus !== "ALL") params.set("status", newStatus);
    if (newTaluka) params.set("taluka", newTaluka);
    return `/admin/members${params.toString() ? "?" + params.toString() : ""}`;
  }

  // Debounced navigation on any control change
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const timer = setTimeout(() => {
      router.push(buildUrl(q, status, taluka), { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, taluka]);

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Live search + taluka */}
      <div className="flex flex-col sm:flex-row gap-[12px]">
        <div className="relative flex-1">
          <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[18px] text-[var(--color-text-secondary)] pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search families, members, villages, or email..."
            className="w-full rounded-[14px] border border-[#ece5d5] bg-white pl-[46px] pr-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <select
          value={taluka}
          onChange={(e) => setTaluka(e.target.value)}
          className="rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] cursor-pointer"
        >
          <option value="">All Talukas</option>
          {talukas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-[8px] overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`px-[18px] py-[9px] rounded-[40px] text-[15px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? "bg-[var(--color-bg-secondary)] text-white"
                  : "bg-white border border-[#ece5d5] text-[var(--color-text)] hover:border-[var(--color-primary)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
