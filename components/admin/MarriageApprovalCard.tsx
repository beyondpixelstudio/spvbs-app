"use client";

import { useState } from "react";
import { approveMarriage, rejectMarriage, getMarriageDetails } from "@/app/actions/marriage-approval";

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending", color: "#8a6d1a", bg: "#ffc03920" },
  APPROVED: { label: "Approved", color: "#0e7a3d", bg: "#18b76020" },
  REJECTED: { label: "Rejected", color: "#a11f4a", bg: "#cc336620" },
};

function ApprovalTick({ label, done, by }: { label: string; done: boolean; by?: string | null }) {
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

export default function MarriageApprovalCard({
  id, groomName, brideName, taluka, marriageDate, status, rejectionReason,
  submitterName, submitterTaluka, submitterVillage, submitterProfilePictureUrl,
  talukaApproved, centralApproved, adminApproved,
  talukaApprovedBy, centralApprovedBy, adminApprovedBy,
  canApproveTaluka, canApproveCentral, canApproveAdmin,
}: {
  id: string; groomName: string; brideName: string; taluka: string; marriageDate: string;
  status: string; rejectionReason: string | null;
  submitterName?: string; submitterTaluka?: string; submitterVillage?: string; submitterProfilePictureUrl?: string | null;
  talukaApproved: boolean; centralApproved: boolean; adminApproved: boolean;
  talukaApprovedBy?: string | null; centralApprovedBy?: string | null; adminApprovedBy?: string | null;
  canApproveTaluka: boolean; canApproveCentral: boolean; canApproveAdmin: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const badge = statusBadge[status] ?? statusBadge.PENDING;

  async function toggleDetails() {
    if (detailsOpen) { setDetailsOpen(false); return; }
    if (!details) {
      setDetailsLoading(true);
      const res = await getMarriageDetails(id);
      setDetailsLoading(false);
      if (res?.details) setDetails(res.details);
    }
    setDetailsOpen(true);
  }

  const isFinal = status === "APPROVED" || status === "REJECTED";

  // Which level can THIS user act on (that isn't already approved)?
  const pendingActions: { level: "TALUKA" | "CENTRAL" | "ADMIN"; label: string }[] = [];
  if (!isFinal) {
    if (canApproveTaluka && !talukaApproved) pendingActions.push({ level: "TALUKA", label: "Taluka Approve" });
    if (canApproveCentral && !centralApproved) pendingActions.push({ level: "CENTRAL", label: "Central Approve" });
    if (canApproveAdmin && !adminApproved) pendingActions.push({ level: "ADMIN", label: "Admin Approve" });
  }

  async function handleApprove(level: "TALUKA" | "CENTRAL" | "ADMIN") {
    setLoading(true);
    await approveMarriage(id, level);
    setLoading(false);
  }
  async function handleReject(level: "TALUKA" | "CENTRAL" | "ADMIN") {
    setLoading(true);
    await rejectMarriage(id, level, reason);
    setLoading(false);
    setShowReject(false);
  }

  const rejectLevel = pendingActions[0]?.level || "ADMIN";

  return (
    <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[24px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
      <div className="flex items-start justify-between gap-[14px] flex-wrap">
        <div className="min-w-0">
          <h4 className="!text-[19px] text-[var(--color-bg-secondary)]">
            {groomName} <span className="text-[var(--color-secondary)]">×</span> {brideName}
          </h4>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
            Taluka: {taluka} • Date: {marriageDate}
          </p>
          {submitterName && (
            <div className="flex items-center gap-[8px] mt-[6px]">
              {submitterProfilePictureUrl ? (
                <img
                  src={submitterProfilePictureUrl}
                  alt={submitterName}
                  className="w-[22px] h-[22px] rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-[22px] h-[22px] rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[10px] font-medium shrink-0">
                  {submitterName.charAt(0).toUpperCase()}
                </div>
              )}
              <p className="text-[12px] text-[var(--color-text-secondary)]">
                Applied by: <span className="text-[var(--color-primary)] font-medium">{submitterName}</span>
                {submitterTaluka ? ` • ${submitterTaluka}` : ""}{submitterVillage ? ` • ${submitterVillage}` : ""}
              </p>
            </div>
          )}
        </div>
        <span className="text-[12px] font-medium px-[12px] py-[5px] rounded-[40px]" style={{ color: badge.color, background: badge.bg }}>
          {badge.label}
        </span>
      </div>

      {/* Approval progress */}
      <div className="flex flex-wrap gap-[18px] mt-[16px] pt-[16px] border-t border-[#f0eadd]">
        <ApprovalTick label="Taluka Committee" done={talukaApproved} by={talukaApprovedBy} />
        <ApprovalTick label="Central Committee" done={centralApproved} by={centralApprovedBy} />
        <ApprovalTick label="Admin" done={adminApproved} by={adminApprovedBy} />
      </div>

      {/* Full details toggle */}
      <div className="mt-[16px]">
        <button onClick={toggleDetails} className="text-[14px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer">
          {detailsOpen ? "Hide full details ▲" : detailsLoading ? "Loading..." : "View full details ▼"}
        </button>
      </div>

      {detailsOpen && details && (
        <div className="mt-[14px] grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          {(["groom", "bride"] as const).map((sideKey) => {
            const s = details[sideKey];
            const title = sideKey === "groom" ? "ବର (Groom)" : "କନ୍ୟା (Bride)";
            return (
              <div key={sideKey} className="bg-[#faf8f3] border border-[#ece5d5] rounded-[16px] p-[16px]">
                <div className="text-[14px] font-medium text-[var(--color-secondary)] mb-[10px]">{title}</div>
                {s.photoUrl && (
                  <img src={s.photoUrl} alt={title} onClick={() => window.open(s.photoUrl, "_blank")} className="w-[90px] h-[90px] rounded-[12px] object-cover border border-[#ece5d5] mb-[10px] cursor-pointer" />
                )}
                <div className="flex flex-col gap-[4px] text-[13px] text-[var(--color-text)]">
                  <div><span className="text-[var(--color-text-secondary)]">Name:</span> {s.name}</div>
                  {s.father && <div><span className="text-[var(--color-text-secondary)]">Father:</span> {s.father}</div>}
                  {s.age && <div><span className="text-[var(--color-text-secondary)]">Age:</span> {s.age}</div>}
                  {s.education && <div><span className="text-[var(--color-text-secondary)]">Education:</span> {s.education}</div>}
                  {s.village && <div><span className="text-[var(--color-text-secondary)]">Village:</span> {s.village}</div>}
                  {s.post && <div><span className="text-[var(--color-text-secondary)]">Post:</span> {s.post}</div>}
                  {s.bhaya && <div><span className="text-[var(--color-text-secondary)]">Bhaya:</span> {s.bhaya}</div>}
                  {s.district && <div><span className="text-[var(--color-text-secondary)]">District:</span> {s.district}</div>}
                  {s.phone && <div><span className="text-[var(--color-text-secondary)]">Phone:</span> {s.phone}</div>}
                </div>
                {s.witnesses?.length > 0 && (
                  <div className="mt-[10px] pt-[10px] border-t border-[#ece5d5]">
                    <div className="text-[12px] uppercase tracking-[0.5px] text-[var(--color-text-secondary)] mb-[6px]">Witnesses</div>
                    <div className="flex flex-col gap-[6px]">
                      {s.witnesses.map((w: any, i: number) => (
                        <div key={i} className="flex items-center gap-[8px] text-[13px]">
                          <span>{w.name}</span>
                          {w.url && <button onClick={() => window.open(w.url, "_blank")} className="text-[var(--color-primary)] hover:opacity-80 cursor-pointer">(signature)</button>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {details.declaration && (
            <div className="lg:col-span-2 bg-[#faf8f3] border border-[#ece5d5] rounded-[16px] p-[16px] text-[13px] text-[var(--color-text)]">
              <span className="text-[var(--color-text-secondary)]">Declaration:</span> {details.declaration}
            </div>
          )}
        </div>
      )}

      {status === "REJECTED" && rejectionReason && (
        <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px] mt-[14px]">
          Rejected: {rejectionReason}
        </p>
      )}

      {/* Actions */}
      {!isFinal && (pendingActions.length > 0) && (
        <div className="mt-[16px]">
          {!showReject ? (
            <div className="flex flex-wrap items-center gap-[10px]">
              {pendingActions.map((a) => (
                <button
                  key={a.level}
                  onClick={() => handleApprove(a.level)}
                  disabled={loading}
                  className="bg-[var(--color-extra-green)] text-white rounded-[40px] px-[20px] py-[9px] text-[14px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "..." : a.label}
                </button>
              ))}
              <button
                onClick={() => setShowReject(true)}
                disabled={loading}
                className="border border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-[40px] px-[20px] py-[9px] text-[14px] font-medium hover:bg-[var(--color-secondary)] hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[10px]">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="Reason for rejection..."
                className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[10px] text-[15px] outline-none focus:border-[var(--color-primary)] resize-y"
              />
              <div className="flex items-center gap-[10px]">
                <button onClick={() => handleReject(rejectLevel)} disabled={loading} className="bg-[var(--color-secondary)] text-white rounded-[40px] px-[20px] py-[9px] text-[14px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50">
                  {loading ? "..." : "Confirm Reject"}
                </button>
                <button onClick={() => setShowReject(false)} className="text-[14px] text-[var(--color-text-secondary)] hover:opacity-80 cursor-pointer">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {!isFinal && pendingActions.length === 0 && (
        <p className="text-[13px] text-[var(--color-text-secondary)] mt-[14px]">
          You have no pending approval action for this application (view only, or already approved by you).
        </p>
      )}
    </div>
  );
}
