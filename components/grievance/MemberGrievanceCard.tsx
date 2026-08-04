"use client";

import { useState } from "react";
import GrievanceThread from "./GrievanceThread";
import { withdrawGrievance, appealGrievance } from "@/app/actions/grievance";

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: "Open", color: "#8a6d1a", bg: "#ffc03920" },
  IN_PROGRESS: { label: "In Progress", color: "#1a5a8a", bg: "#cedbf540" },
  RESOLVED: { label: "Resolved", color: "#0e7a3d", bg: "#18b76020" },
  APPEALED: { label: "Appealed", color: "#a11f4a", bg: "#cc336620" },
  CLOSED: { label: "Closed", color: "#666666", bg: "#66666615" },
  WITHDRAWN: { label: "Withdrawn", color: "#666666", bg: "#66666615" },
};

const categoryLabels: Record<string, string> = {
  COMMITTEE: "Against Committee/Admin",
  MEMBER: "Against a Member",
  EVENT: "Event / Function",
  FINANCIAL: "Financial / Donation",
  SUGGESTION: "Suggestion / Feedback",
  OTHER: "Other",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MemberGrievanceCard({
  id,
  subject,
  description,
  category,
  againstWhom,
  status,
  adminNotes,
  createdAt,
  comments,
}: {
  id: string;
  subject: string;
  description: string;
  category: string;
  againstWhom: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  comments: {
    id: string;
    authorRole: string;
    body: string;
    attachmentUrl: string | null;
    createdAt: string;
  }[];
}) {
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const badge = statusBadge[status] ?? statusBadge.OPEN;
  const isFinal = status === "CLOSED" || status === "WITHDRAWN";
  const canWithdraw =
    status === "OPEN" || status === "IN_PROGRESS" || status === "APPEALED";
  const canAppeal = status === "RESOLVED";

  async function handleWithdraw() {
    if (!confirm("Withdraw this grievance? This is final — you won't be able to reopen it.")) return;
    setLoading(true);
    await withdrawGrievance(id);
    setLoading(false);
  }
  async function handleAppeal() {
    if (!confirm("Appeal this grievance? It will be reopened for the admin to review again.")) return;
    setLoading(true);
    await appealGrievance(id);
    setLoading(false);
  }

  return (
    <div
      className="bg-white rounded-[20px] border border-[#ece5d5] p-[24px]"
      style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <div className="flex items-center gap-[8px] flex-wrap mb-[6px]">
            <span className="text-[12px] font-medium px-[10px] py-[3px] rounded-[40px] bg-[#faf8f3] border border-[#ece5d5] text-[var(--color-text-secondary)]">
              {categoryLabels[category] || category}
            </span>
            <span
              className="text-[12px] font-medium px-[10px] py-[3px] rounded-[40px]"
              style={{ color: badge.color, background: badge.bg }}
            >
              {badge.label}
            </span>
          </div>
          <h4 className="!text-[18px] text-[var(--color-bg-secondary)]">{subject}</h4>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
            {formatDate(createdAt)}
            {againstWhom ? ` • Regarding: ${againstWhom}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-[12px] shrink-0">
          {canWithdraw && (
            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="text-[14px] text-[var(--color-secondary)] font-medium hover:opacity-80 cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Withdraw"}
            </button>
          )}
          {canAppeal && (
            <button
              onClick={handleAppeal}
              disabled={loading}
              className="text-[14px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Appeal"}
            </button>
          )}
        </div>
      </div>

      <p className="text-[15px] text-[var(--color-text)] mt-[12px]">{description}</p>

      {adminNotes && (
        <div className="mt-[14px] bg-[#faf8f3] border border-[#ece5d5] rounded-[14px] px-[16px] py-[12px]">
          <div className="text-[12px] tracking-[0.5px] uppercase text-[var(--color-primary)] font-medium mb-[4px]">
            Admin Response
          </div>
          <p className="text-[14px] text-[var(--color-text)]">{adminNotes}</p>
        </div>
      )}

      {/* FINAL: collapsed history. ACTIVE: live thread */}
      {isFinal ? (
        <div className="mt-[16px]">
          <button
            onClick={() => setHistoryOpen((o) => !o)}
            className="text-[15px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer"
          >
            {historyOpen ? "Hide conversation history ▲" : `View conversation history (${comments.length}) ▼`}
          </button>
          {historyOpen && (
            <GrievanceThread grievanceId={id} comments={comments} viewerRole="MEMBER" disabled={true} />
          )}
        </div>
      ) : (
        <GrievanceThread grievanceId={id} comments={comments} viewerRole="MEMBER" disabled={false} />
      )}
    </div>
  );
}
