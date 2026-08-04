"use client";

import { useState } from "react";
import { approveFamily, rejectFamily, reactivateFamily } from "@/app/actions/admin";

type Props = {
  userId: string;
  email: string;
  familyName: string;
  location: string;
  memberCount: number;
  mobile?: string;
  variant: "pending" | "suspended";
};

export default function ApprovalCard({
  userId,
  email,
  familyName,
  location,
  memberCount,
  mobile,
  variant,
}: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handle(action: "approve" | "reject" | "reactivate") {
    setLoading(action);
    if (action === "approve") await approveFamily(userId);
    else if (action === "reject") await rejectFamily(userId);
    else await reactivateFamily(userId);
    setLoading(null);
  }

  return (
    <div
      className="bg-white rounded-[20px] border border-[var(--color-border)] p-[22px] flex flex-wrap items-center justify-between gap-[16px]"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <div className="flex items-center gap-[16px] min-w-0">
        <div className="w-[50px] h-[50px] rounded-[16px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[20px] font-[family-name:var(--font-heading)] shrink-0">
          {familyName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="text-[17px] font-medium text-[var(--color-bg-secondary)] truncate">
            {familyName}
          </div>
          <div className="text-[14px] text-[var(--color-text-secondary)]">
            {location} • {memberCount} {memberCount === 1 ? "member" : "members"}
          </div>
          <div className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
            {email}{mobile ? ` • ${mobile}` : ""}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        {variant === "pending" ? (
          <>
            <button
              onClick={() => handle("approve")}
              disabled={!!loading}
              className="bg-[var(--color-extra-green)] text-white rounded-[40px] px-[20px] py-[10px] text-[15px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {loading === "approve" ? "..." : "Approve"}
            </button>
            <button
              onClick={() => handle("reject")}
              disabled={!!loading}
              className="border border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-[40px] px-[20px] py-[10px] text-[15px] font-medium hover:bg-[var(--color-secondary)] hover:text-white transition-all cursor-pointer disabled:opacity-50"
            >
              {loading === "reject" ? "..." : "Reject"}
            </button>
          </>
        ) : (
          <button
            onClick={() => handle("reactivate")}
            disabled={!!loading}
            className="bg-[var(--color-primary)] text-white rounded-[40px] px-[20px] py-[10px] text-[15px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
          >
            {loading === "reactivate" ? "..." : "Reactivate"}
          </button>
        )}
      </div>
    </div>
  );
}
