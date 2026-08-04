"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { unlockDocuments } from "@/app/actions/documents";

type UnlockedDoc = { id: string; docType: string; fileName: string; url: string | null };

export default function SharedDocuments({
  memberId,
  memberName,
  docCount,
}: {
  memberId: string;
  memberName: string;
  docCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [docs, setDocs] = useState<UnlockedDoc[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUnlock() {
    setError("");
    setLoading(true);
    const res = await unlockDocuments(memberId, password);
    setLoading(false);
    if (res?.error) {
      setError(res.error);
      setDocs(null);
    } else {
      setDocs(res.documents || []);
      setPassword("");
    }
  }

  return (
    <div className="bg-white rounded-[16px] border border-[#ece5d5] p-[18px] mt-[12px]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-[10px] text-[15px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer"
        >
          🔒 {memberName} has {docCount} shared {docCount === 1 ? "document" : "documents"} — unlock with password
        </button>
      ) : (
        <div>
          <div className="text-[13px] tracking-[1px] uppercase text-[var(--color-primary)] font-medium mb-[10px]">
            Shared documents — {memberName}
          </div>
          {!docs ? (
            <>
              <div className="flex flex-col sm:flex-row gap-[10px] items-end">
                <div className="flex-1 w-full">
                  <Input
                    id={`shared-${memberId}`}
                    label=""
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password to view"
                  />
                </div>
                <Button variant="secondary" onClick={handleUnlock}>
                  {loading ? "..." : "Unlock"}
                </Button>
              </div>
              {error && <p className="text-[13px] text-[var(--color-secondary)] mt-[8px]">{error}</p>}
              <button
                onClick={() => { setOpen(false); setError(""); setPassword(""); }}
                className="text-[13px] text-[var(--color-text-secondary)] hover:opacity-80 cursor-pointer mt-[10px]"
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-[8px]">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-[12px] bg-[#faf8f3] border border-[#ece5d5] rounded-[12px] px-[14px] py-[10px]">
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
              <button
                onClick={() => { setDocs(null); setOpen(false); }}
                className="text-[13px] text-[var(--color-primary)] hover:opacity-80 cursor-pointer mt-[4px] text-left"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
