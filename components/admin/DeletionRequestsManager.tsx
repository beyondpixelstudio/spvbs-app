"use client";

import { useState } from "react";
import { approveDeletionRequest, rejectDeletionRequest } from "@/app/actions/deletion-requests";

type ProposedChanges = Record<string, string | null> | null;

type RequestItem = {
  id: string;
  requestType: string;
  memberName: string;
  relation: string;
  familyName: string;
  taluka: string;
  status: string;
  reason: string | null;
  rejectionReason: string | null;
  proposedChanges: ProposedChanges;
  requestedByName: string;
  requestedByPhoto: string | null;
  memberPhoto: string | null;
  createdAt: string;
};

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "#8a6d1a", bg: "#ffc03920" },
  APPROVED: { label: "Approved", color: "#0e7a3d", bg: "#18b76020" },
  REJECTED: { label: "Rejected", color: "#a11f4a", bg: "#cc336620" },
};

const TABS = [
  { key: "DELETE", label: "Delete" },
  { key: "EDIT", label: "Edit" },
  { key: "ADD", label: "Add" },
] as const;

const fieldLabels: Record<string, string> = {
  relation: "Relation",
  fullName: "Full Name",
  gender: "Gender",
  dob: "Date of Birth",
  maritalStatus: "Marital Status",
  qualification: "Qualification",
  occupation: "Occupation",
  mobileNumber: "Mobile Number",
  bloodGroup: "Blood Group",
  currentStatus: "Current Status",
  villageTown: "Village/Town",
};

export default function DeletionRequestsManager({ requests }: { requests: RequestItem[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("DELETE");

  async function handleApprove(id: string, name: string, type: string) {
    const verb = type === "ADD" ? "add" : type === "EDIT" ? "apply the edits for" : "delete";
    if (!confirm(`Approve request to ${verb} "${name}"? This cannot be undone.`)) return;
    setLoading(id);
    const res = await approveDeletionRequest(id);
    setLoading(null);
    if (res?.error) alert(res.error);
  }

  async function handleReject(id: string) {
    const reason = prompt("Reason for rejecting this request (optional):") || "";
    setLoading(id);
    const res = await rejectDeletionRequest(id, reason);
    setLoading(null);
    if (res?.error) alert(res.error);
  }

  function RequestCard({ r }: { r: RequestItem }) {
    const badge = statusBadge[r.status] ?? statusBadge.PENDING;
    const isExpanded = expanded === r.id;
    return (
      <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[22px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
        <div className="flex flex-wrap items-center justify-between gap-[16px]">
          <div className="flex items-center gap-[12px] min-w-0">
            {r.memberPhoto ? (
              <img src={r.memberPhoto} alt={r.memberName} className="w-[44px] h-[44px] rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-[44px] h-[44px] rounded-full bg-[var(--color-bg-secondary)] text-white flex items-center justify-center text-[16px] font-medium shrink-0">
                {r.memberName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[17px] font-medium text-[var(--color-bg-secondary)]">
                {r.memberName} <span className="text-[13px] text-[var(--color-text-secondary)] font-normal">({r.relation})</span>
              </div>
              <div className="text-[14px] text-[var(--color-text-secondary)] mt-[2px]">
                {r.familyName}{r.taluka ? ` • ${r.taluka}` : ""}
              </div>
              <div className="flex items-center gap-[8px] mt-[6px]">
                {r.requestedByPhoto ? (
                  <img src={r.requestedByPhoto} alt={r.requestedByName} className="w-[22px] h-[22px] rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-[22px] h-[22px] rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                    {r.requestedByName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[13px] text-[var(--color-text-secondary)]">
                  Requested by: <span className="text-[var(--color-primary)] font-medium">{r.requestedByName}</span>
                </span>
              </div>
              {r.reason && (
                <div className="text-[13px] text-[var(--color-text)] mt-[4px]">Reason for deletion: {r.reason}</div>
              )}
              {r.rejectionReason && (
                <div className="text-[13px] text-[var(--color-secondary)] mt-[4px]">Rejection reason: {r.rejectionReason}</div>
              )}
              {r.proposedChanges && (
                <button
                  onClick={() => setExpanded(isExpanded ? null : r.id)}
                  className="text-[13px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer mt-[6px]"
                >
                  {isExpanded ? "Hide details ▲" : "View proposed details ▼"}
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-[10px] shrink-0">
            <span className="text-[12px] font-medium px-[12px] py-[5px] rounded-[40px]" style={{ color: badge.color, background: badge.bg }}>
              {badge.label}
            </span>
            {r.status === "PENDING" && (
              <>
                <button
                  onClick={() => handleApprove(r.id, r.memberName, r.requestType)}
                  disabled={loading === r.id}
                  className="bg-[var(--color-extra-green)] text-white rounded-[40px] px-[16px] py-[8px] text-[14px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {loading === r.id ? "..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(r.id)}
                  disabled={loading === r.id}
                  className="border border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-[40px] px-[16px] py-[8px] text-[14px] font-medium hover:bg-[var(--color-secondary)] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>

        {isExpanded && r.proposedChanges && (
          <div className="mt-[16px] pt-[16px] border-t border-[#f0eadd] grid grid-cols-1 sm:grid-cols-2 gap-[8px]">
            {Object.entries(r.proposedChanges)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="text-[13px]">
                  <span className="text-[var(--color-text-secondary)]">{fieldLabels[k] || k}: </span>
                  <span className="text-[var(--color-text)] font-medium">{v}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  const pendingCounts = Object.fromEntries(
    TABS.map((t) => [t.key, requests.filter((r) => r.requestType === t.key && r.status === "PENDING").length])
  );

  const tabRequests = requests.filter((r) => r.requestType === activeTab);
  const pending = tabRequests.filter((r) => r.status === "PENDING");
  const decided = tabRequests.filter((r) => r.status !== "PENDING");

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-[8px] mb-[24px] border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative px-[18px] py-[12px] text-[15px] font-medium cursor-pointer transition-colors ${
              activeTab === t.key
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {t.label}
            {pendingCounts[t.key] > 0 && (
              <span className="ml-[6px] inline-flex items-center justify-center min-w-[18px] h-[18px] px-[4px] rounded-full bg-[var(--color-secondary)] text-white text-[11px] font-medium">
                {pendingCounts[t.key]}
              </span>
            )}
            {activeTab === t.key && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--color-primary)]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[30px]">
        <div>
          <div className="flex items-center gap-[12px] mb-[18px]">
            <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
              Pending ({pending.length})
            </span>
            <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
          </div>
          {pending.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[30px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
              <p className="text-[15px] text-[var(--color-text)]">No pending requests.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-[14px]">
              {pending.map((r) => <RequestCard key={r.id} r={r} />)}
            </div>
          )}
        </div>

        {decided.length > 0 && (
          <div>
            <div className="flex items-center gap-[12px] mb-[18px]">
              <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-text-secondary)] font-medium">
                History ({decided.length})
              </span>
              <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
            </div>
            <div className="flex flex-col gap-[14px]">
              {decided.map((r) => <RequestCard key={r.id} r={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
