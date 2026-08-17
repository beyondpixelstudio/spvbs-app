"use client";

import Link from "next/link";
import { useState } from "react";
import { approveFamily, rejectFamily } from "@/app/actions/admin";

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "#8a6d1a", bg: "#ffc03920" },
  APPROVED: { label: "Approved", color: "#0e7a3d", bg: "#18b76020" },
  SUSPENDED: { label: "Suspended", color: "#a11f4a", bg: "#cc336620" },
};

export default function AdminMemberCard({
  familyId,
  familyHeadUserId,
  familyName,
  location,
  memberCount,
  email,
  status,
  profilePictureUrl,
}: {
  familyId: string;
  familyHeadUserId: string;
  familyName: string;
  location: string;
  memberCount: number;
  email: string;
  status: string;
  profilePictureUrl?: string;
}) {
  const [loading, setLoading] = useState(false);
  const badge = statusBadge[status] ?? statusBadge.PENDING;

  async function suspend() {
    if (!confirm(`Suspend ${familyName}? They will be removed from the public directory.`)) return;
    setLoading(true);
    await rejectFamily(familyHeadUserId);
    setLoading(false);
  }
  async function activate() {
    setLoading(true);
    await approveFamily(familyHeadUserId);
    setLoading(false);
  }

  return (
    <div
      className="bg-white rounded-[20px] border border-[#ece5d5] p-[22px] flex flex-wrap items-center justify-between gap-[16px] transition-all hover:border-[var(--color-primary)]/40"
      style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
    >
      <div className="flex items-center gap-[16px] min-w-0">
        {profilePictureUrl ? (
          <img
            src={profilePictureUrl}
            alt={familyName}
            className="w-[50px] h-[50px] rounded-[16px] object-cover shrink-0"
          />
        ) : (
          <div className="w-[50px] h-[50px] rounded-[16px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[20px] font-[family-name:var(--font-heading)] shrink-0">
            {familyName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[17px] font-medium text-[var(--color-bg-secondary)] truncate">
            {familyName}
          </div>
          <div className="text-[14px] text-[var(--color-text-secondary)]">
            {location} • {memberCount} {memberCount === 1 ? "member" : "members"}
          </div>
          <div className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
            {email}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-[12px]">
        <span
          className="text-[12px] font-medium px-[12px] py-[5px] rounded-[40px]"
          style={{ color: badge.color, background: badge.bg }}
        >
          {badge.label}
        </span>

        <Link
          href={`/members/${familyId}`}
          className="text-[15px] text-[var(--color-primary)] font-medium hover:opacity-80"
        >
          View
        </Link>

        {status === "APPROVED" && (
          <button
            onClick={suspend}
            disabled={loading}
            className="text-[15px] text-[var(--color-secondary)] font-medium hover:opacity-80 cursor-pointer disabled:opacity-50"
          >
            {loading ? "..." : "Suspend"}
          </button>
        )}
        {status === "SUSPENDED" && (
          <button
            onClick={activate}
            disabled={loading}
            className="text-[15px] text-[var(--color-extra-green)] font-medium hover:opacity-80 cursor-pointer disabled:opacity-50"
          >
            {loading ? "..." : "Reactivate"}
          </button>
        )}
        {status === "PENDING" && (
          <button
            onClick={activate}
            disabled={loading}
            className="text-[15px] text-[var(--color-extra-green)] font-medium hover:opacity-80 cursor-pointer disabled:opacity-50"
          >
            {loading ? "..." : "Approve"}
          </button>
        )}
      </div>
    </div>
  );
}
