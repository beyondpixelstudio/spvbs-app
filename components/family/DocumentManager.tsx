"use client";

import { useState, useRef } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import DocumentAccessManager from "@/components/family/DocumentAccessManager";
import {
  setDocsPassword,
  viewDocsPassword,
  uploadDocument,
  deleteDocument,
  unlockDocuments,
} from "@/app/actions/documents";

type Doc = { id: string; docType: string; fileName: string };
type Member = {
  id: string;
  fullName: string;
  relation: string;
  hasPassword: boolean;
  shared: boolean;
  documents: Doc[];
};
type UnlockedDoc = { id: string; docType: string; fileName: string; url: string | null };

function MemberVault({ member, profilePictureUrl }: { member: Member; profilePictureUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(member.hasPassword);

  // set/change password (requires account password)
  const [newPwd, setNewPwd] = useState("");
  const [acctPwd, setAcctPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // view existing password (requires account password)
  const [showViewBox, setShowViewBox] = useState(false);
  const [viewAcctPwd, setViewAcctPwd] = useState("");
  const [revealedPwd, setRevealedPwd] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewMsg, setViewMsg] = useState("");

  // share toggle
  const [shared, setShared] = useState(member.shared);

  // upload
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [upLoading, setUpLoading] = useState(false);
  const [upMsg, setUpMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // unlock/view documents (uses document password)
  const [unlockPwd, setUnlockPwd] = useState("");
  const [unlocked, setUnlocked] = useState<UnlockedDoc[] | null>(null);
  const [unlockMsg, setUnlockMsg] = useState("");
  const [unlockLoading, setUnlockLoading] = useState(false);

  async function handleSetPassword() {
    setPwdMsg(null);
    if (newPwd.length < 4) {
      setPwdMsg({ type: "err", text: "New password must be at least 4 characters." });
      return;
    }
    if (!acctPwd) {
      setPwdMsg({ type: "err", text: "Enter your account password to confirm." });
      return;
    }
    setPwdLoading(true);
    const res = await setDocsPassword(member.id, newPwd, acctPwd);
    setPwdLoading(false);
    if (res?.error) setPwdMsg({ type: "err", text: res.error });
    else {
      setPwdMsg({ type: "ok", text: "Password saved." });
      setNewPwd("");
      setAcctPwd("");
      setHasPassword(true);
    }
  }

  async function handleViewPassword() {
    setViewMsg("");
    setRevealedPwd(null);
    setViewLoading(true);
    const res = await viewDocsPassword(member.id, viewAcctPwd);
    setViewLoading(false);
    if (res?.error) setViewMsg(res.error);
    else {
      setRevealedPwd(res.password || "");
      setViewAcctPwd("");
    }
  }

  async function handleUpload() {
    setUpMsg(null);
    if (!file) {
      setUpMsg({ type: "err", text: "Choose a file first." });
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("docType", docType || "Document");
    setUpLoading(true);
    const res = await uploadDocument(member.id, fd);
    setUpLoading(false);
    if (res?.error) setUpMsg({ type: "err", text: res.error });
    else {
      setUpMsg({ type: "ok", text: "Uploaded." });
      setFile(null);
      setDocType("");
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(docId);
  }

  async function handleUnlock() {
    setUnlockMsg("");
    setUnlockLoading(true);
    const res = await unlockDocuments(member.id, unlockPwd);
    setUnlockLoading(false);
    if (res?.error) {
      setUnlockMsg(res.error);
      setUnlocked(null);
    } else {
      setUnlocked(res.documents || []);
      setUnlockPwd("");
    }
  }

  return (
    <div
      className="bg-white rounded-[20px] border border-[#ece5d5] overflow-hidden"
      style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-[14px] px-[24px] py-[18px] hover:bg-[#faf8f3] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-[14px] min-w-0">
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt={member.fullName}
              className="w-[44px] h-[44px] rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-[44px] h-[44px] rounded-full bg-[var(--color-bg-secondary)] text-white flex items-center justify-center text-[16px] font-[family-name:var(--font-heading)] shrink-0">
              {member.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 text-left">
            <div className="text-[16px] font-medium text-[var(--color-bg-secondary)] truncate">
              {member.fullName}
            </div>
            <div className="text-[13px] text-[var(--color-text-secondary)]">
              {member.relation} • {member.documents.length}{" "}
              {member.documents.length === 1 ? "document" : "documents"}
            </div>
          </div>
        </div>
        <span className="text-[var(--color-text-secondary)] text-[14px] shrink-0">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="px-[24px] pb-[24px] pt-[10px] border-t border-[#f0eadd] flex flex-col gap-[24px]">
          {/* ===== Password (set/change with account verification) ===== */}
          <div>
            <div className="text-[13px] tracking-[1px] uppercase text-[var(--color-primary)] font-medium mb-[10px]">
              {hasPassword ? "Change document password" : "Set document password"}
            </div>
            <div className="flex flex-col gap-[10px]">
              <Input
                id={`newpwd-${member.id}`}
                label="Document password"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder={hasPassword ? "New document password" : "Create a password (min 4 chars)"}
              />
              <Input
                id={`acct-${member.id}`}
                label="Confirm with your account password"
                type="password"
                value={acctPwd}
                onChange={(e) => setAcctPwd(e.target.value)}
                placeholder="Your login password"
              />
            </div>
            {pwdMsg && (
              <p className={`text-[13px] mt-[8px] ${pwdMsg.type === "ok" ? "text-[#0e7a3d]" : "text-[var(--color-secondary)]"}`}>
                {pwdMsg.text}
              </p>
            )}
            <div className="mt-[12px]">
              <Button variant="primary" onClick={handleSetPassword}>
                {pwdLoading ? "Verifying..." : hasPassword ? "Change password" : "Set password"}
              </Button>
            </div>

            {/* View existing password */}
            {hasPassword && (
              <div className="mt-[14px]">
                {!showViewBox ? (
                  <button
                    onClick={() => { setShowViewBox(true); setRevealedPwd(null); setViewMsg(""); }}
                    className="text-[13px] text-[var(--color-primary)] hover:opacity-80 cursor-pointer"
                  >
                    👁 View current password
                  </button>
                ) : (
                  <div className="bg-[#faf8f3] border border-[#ece5d5] rounded-[14px] p-[16px]">
                    <p className="text-[13px] text-[var(--color-text-secondary)] mb-[10px]">
                      Enter your account password to reveal the current document password.
                    </p>
                    {revealedPwd === null ? (
                      <>
                        <Input
                          id={`viewacct-${member.id}`}
                          label=""
                          type="password"
                          value={viewAcctPwd}
                          onChange={(e) => setViewAcctPwd(e.target.value)}
                          placeholder="Your account password"
                        />
                        {viewMsg && <p className="text-[13px] text-[var(--color-secondary)] mt-[8px]">{viewMsg}</p>}
                        <div className="flex items-center gap-[12px] mt-[12px]">
                          <Button variant="secondary" onClick={handleViewPassword}>
                            {viewLoading ? "..." : "Reveal"}
                          </Button>
                          <button
                            onClick={() => { setShowViewBox(false); setViewAcctPwd(""); setViewMsg(""); }}
                            className="text-[14px] text-[var(--color-text-secondary)] hover:opacity-80 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="text-[12px] tracking-[0.5px] uppercase text-[var(--color-text-secondary)]">
                          Current document password
                        </div>
                        <div className="text-[18px] font-medium text-[var(--color-bg-secondary)] mt-[4px] font-mono">
                          {revealedPwd}
                        </div>
                        <button
                          onClick={() => { setShowViewBox(false); setRevealedPwd(null); }}
                          className="text-[13px] text-[var(--color-primary)] hover:opacity-80 cursor-pointer mt-[10px]"
                        >
                          Hide
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ===== Specific access grants ===== */}
          {hasPassword && <DocumentAccessManager memberId={member.id} />}

          {/* ===== Upload (only after password set) ===== */}
          {hasPassword ? (
            <div>
              <div className="text-[13px] tracking-[1px] uppercase text-[var(--color-primary)] font-medium mb-[10px]">
                Upload a document
              </div>
              <div className="flex flex-col sm:flex-row gap-[10px]">
                <input
                  type="text"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  placeholder="Document type (e.g. Aadhaar, Certificate)"
                  className="flex-1 rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                />
                <label className="flex items-center justify-center rounded-[14px] border border-[#ece5d5] bg-[#faf8f3] px-[16px] py-[12px] text-[15px] text-[var(--color-primary)] cursor-pointer hover:opacity-80 whitespace-nowrap">
                  📎 {file ? "Change file" : "Choose file"}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                <Button variant="primary" onClick={handleUpload}>
                  {upLoading ? "..." : "Upload"}
                </Button>
              </div>
              {file && <p className="text-[13px] text-[var(--color-text-secondary)] mt-[6px]">Selected: {file.name}</p>}
              {upMsg && (
                <p className={`text-[13px] mt-[6px] ${upMsg.type === "ok" ? "text-[#0e7a3d]" : "text-[var(--color-secondary)]"}`}>
                  {upMsg.text}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-[#ffc03915] border border-[#ffc03955] rounded-[14px] px-[16px] py-[12px]">
              <p className="text-[14px] text-[var(--color-text)]">
                🔑 Set a password above first — then you can upload documents.
              </p>
            </div>
          )}

          {/* ===== Documents list ===== */}
          {member.documents.length > 0 && (
            <div>
              <div className="text-[13px] tracking-[1px] uppercase text-[var(--color-text-secondary)] font-medium mb-[10px]">
                Stored documents ({member.documents.length})
              </div>
              <div className="flex flex-col gap-[8px]">
                {member.documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-[12px] bg-[#faf8f3] border border-[#ece5d5] rounded-[12px] px-[14px] py-[10px]">
                    <div className="min-w-0">
                      <span className="text-[15px] text-[var(--color-text)]">🔒 {d.docType}</span>
                      <span className="text-[13px] text-[var(--color-text-secondary)] ml-[8px] truncate">{d.fileName}</span>
                    </div>
                    <button onClick={() => handleDelete(d.id)} className="text-[14px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer shrink-0">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== Unlock/View documents (document password) ===== */}
          {member.documents.length > 0 && hasPassword && (
            <div className="pt-[16px] border-t border-[#f0eadd]">
              <div className="text-[13px] tracking-[1px] uppercase text-[var(--color-primary)] font-medium mb-[10px]">
                View documents
              </div>
              <div className="flex flex-col sm:flex-row gap-[10px] items-end">
                <div className="flex-1 w-full">
                  <Input id={`unlock-${member.id}`} label="" type="password" value={unlockPwd} onChange={(e) => setUnlockPwd(e.target.value)} placeholder="Enter document password to view" />
                </div>
                <Button variant="secondary" onClick={handleUnlock}>
                  {unlockLoading ? "..." : "Unlock"}
                </Button>
              </div>
              {unlockMsg && <p className="text-[13px] text-[var(--color-secondary)] mt-[8px]">{unlockMsg}</p>}
              {unlocked && (
                <div className="flex flex-col gap-[8px] mt-[14px]">
                  {unlocked.map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-[12px] bg-white border border-[#ece5d5] rounded-[12px] px-[14px] py-[10px]">
                      <span className="text-[15px] text-[var(--color-text)] min-w-0 truncate">📄 {d.docType} — {d.fileName}</span>
                      {d.url ? (
                        <button onClick={() => window.open(d.url!, "_blank")} className="text-[14px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer shrink-0">
                          Open
                        </button>
                      ) : (
                        <span className="text-[13px] text-[var(--color-text-secondary)]">Unavailable</span>
                      )}
                    </div>
                  ))}
                  <p className="text-[12px] text-[var(--color-text-secondary)] mt-[4px]">Links expire in 5 minutes for security.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DocumentManager({ members, headProfilePictureUrl }: { members: Member[]; headProfilePictureUrl?: string | null }) {
  return (
    <div className="flex flex-col gap-[14px]">
      {members.map((m) => (
        <MemberVault key={m.id} member={m} profilePictureUrl={m.relation === "Head" ? headProfilePictureUrl : null} />
      ))}
    </div>
  );
}
