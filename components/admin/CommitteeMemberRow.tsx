"use client";

import { useState } from "react";
import { removeCommittee } from "@/app/actions/committee";

const canApprove = (type: string) => type === "Advisor" || type === "Core Committee";

export default function CommitteeMemberRow({
  id, name, level, type, designation, taluka,
}: {
  id: string; name: string; level: string; type: string; designation: string; taluka: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    if (!confirm(`Remove ${name} from ${level} ${type}?`)) return;
    setLoading(true);
    await removeCommittee(id);
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#ece5d5] px-[20px] py-[16px] flex flex-wrap items-center justify-between gap-[12px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
      <div className="flex items-center gap-[14px] min-w-0">
        <div className="w-[44px] h-[44px] rounded-[14px] bg-gradient-to-br from-[var(--color-bg-secondary)] to-[#1a2f5c] text-white flex items-center justify-center text-[16px] font-[family-name:var(--font-heading)] shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-[16px] font-medium text-[var(--color-bg-secondary)] truncate">{name}</div>
          <div className="text-[13px] text-[var(--color-text-secondary)]">
            {designation} • {type}{taluka ? ` • ${taluka}` : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[12px]">
        <span className={`text-[12px] font-medium px-[12px] py-[5px] rounded-[40px] ${level === "Central" ? "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"}`}>
          {level}
        </span>
        {canApprove(type) ? (
          <span className="text-[12px] text-[#0e7a3d] bg-[#18b76015] px-[10px] py-[4px] rounded-[40px]">Can approve</span>
        ) : (
          <span className="text-[12px] text-[var(--color-text-secondary)] bg-[#f0eadd] px-[10px] py-[4px] rounded-[40px]">View only</span>
        )}
        <button onClick={handleRemove} disabled={loading} className="text-[14px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer disabled:opacity-50">
          {loading ? "..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
