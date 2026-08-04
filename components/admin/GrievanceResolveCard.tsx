"use client";

import { useState } from "react";
import { updateGrievance } from "@/app/actions/grievance";
import GrievanceThread from "@/components/grievance/GrievanceThread";

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  OPEN: { label: "Open", color: "#8a6d1a", bg: "#ffc03920" },
  IN_PROGRESS: { label: "In Progress", color: "#1a5a8a", bg: "#cedbf540" },
  RESOLVED: { label: "Resolved", color: "#0e7a3d", bg: "#18b76020" },
  APPEALED: { label: "Appealed", color: "#a11f4a", bg: "#cc336620" },
  CLOSED: { label: "Closed", color: "#666666", bg: "#66666615" },
  WITHDRAWN: { label: "Withdrawn", color: "#666666", bg: "#66666615" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GrievanceResolveCard({
  id,
  subject,
  description,
  category,
  againstWhom,
  status,
  adminNotes,
  submitterName,
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
  submitterName: string;
  createdAt: string;
  comments: {
    id: string;
    authorRole: string;
    body: string;
    attachmentUrl: string | null;
    createdAt: string;
  }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [newStatus, setNewStatus] = useState(status);
  const [notes, setNotes] = useState(adminNotes || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const badge = statusBadge[status] ?? statusBadge.OPEN;
  const isFinal = status === "CLOSED" || status === "WITHDRAWN";

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    await updateGrievance(id, { status: newStatus, adminNotes: notes });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div
      className="bg-white rounded-[20px] border border-[#ece5d5] p-[24px]"
      style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
    >
      <div className="flex items-start justify-between gap-[14px]">
        <div className="min-w-0">
          <div className="flex items-center gap-[10px] flex-wrap mb-[6px]">
            <span className="text-[12px] font-medium px-[10px] py-[3px] rounded-[40px] bg-[#faf8f3] border border-[#ece5d5] text-[var(--color-text-secondary)]">
              {category}
            </span>
            <span
              className="text-[12px] font-medium px-[10px] py-[3px] rounded-[40px]"
              style={{ color: badge.color, background: badge.bg }}
            >
              {badge.label}
            </span>
          </div>
          <h4 className="!text-[19px] text-[var(--color-bg-secondary)]">{subject}</h4>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
            By {submitterName} • {formatDate(createdAt)}
            {againstWhom ? ` • Regarding: ${againstWhom}` : ""}
          </p>
        </div>
      </div>

      <p className="text-[15px] text-[var(--color-text)] mt-[14px]">{description}</p>

      {/* FINAL states: collapsed history */}
      {isFinal ? (
        <div className="mt-[16px]">
          <button
            onClick={() => setHistoryOpen((o) => !o)}
            className="text-[15px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer"
          >
            {historyOpen ? "Hide conversation history ▲" : `View conversation history (${comments.length}) ▼`}
          </button>
          {historyOpen && (
            <GrievanceThread
              grievanceId={id}
              comments={comments}
              viewerRole="ADMIN"
              disabled={true}
            />
          )}
        </div>
      ) : (
        <>
          {/* Resolve controls */}
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="mt-[16px] text-[15px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer"
            >
              {adminNotes ? "Update status →" : "Respond / update status →"}
            </button>
          ) : (
            <div className="mt-[18px] pt-[18px] border-t border-[#f0eadd]">
              <div className="flex flex-col sm:flex-row gap-[14px] items-start">
                <div className="w-full sm:w-[210px]">
                  <label className="text-[14px] font-medium text-[var(--color-text)] block mb-[6px]">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[10px] text-[15px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved (user can appeal)</option>
                    <option value="CLOSED">Closed (final, no appeal)</option>
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="text-[14px] font-medium text-[var(--color-text)] block mb-[6px]">
                    Response note (visible to submitter)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Write a response or resolution note..."
                    className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[10px] text-[15px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] resize-y"
                  />
                </div>
              </div>

              <div className="flex items-center gap-[12px] mt-[14px]">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[var(--color-primary)] text-white rounded-[40px] px-[22px] py-[10px] text-[15px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-[15px] text-[var(--color-text-secondary)] hover:opacity-80 cursor-pointer"
                >
                  Cancel
                </button>
                {saved && <span className="text-[14px] text-[#0e7a3d]">✓ Saved</span>}
              </div>
            </div>
          )}

          {/* Active thread */}
          <GrievanceThread
            grievanceId={id}
            comments={comments}
            viewerRole="ADMIN"
            disabled={false}
          />
        </>
      )}
    </div>
  );
}
