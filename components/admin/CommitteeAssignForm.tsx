"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { assignCommittee } from "@/app/actions/committee";
import { TALUKAS } from "@/lib/site-config";

type Candidate = { userId: string; name: string; taluka: string; email: string };

const LEVELS = [
  { value: "TALUKA", label: "Taluka" },
  { value: "CENTRAL", label: "Central" },
];
const TYPES = [
  { value: "ADVISOR", label: "Advisor" },
  { value: "CORE", label: "Core Committee" },
  { value: "FINANCE", label: "Finance" },
  { value: "MANDIR_PARICHALANA", label: "Mandir Parichalana" },
  { value: "YOUTH_CELL", label: "Youth Cell" },
];
const DESIGNATIONS = [
  { value: "PRESIDENT", label: "President" },
  { value: "SECRETARY", label: "Secretary" },
  { value: "JOINT_SECRETARY", label: "Joint Secretary" },
  { value: "CASHIER", label: "Cashier" },
  { value: "MEMBER", label: "Member" },
];

export default function CommitteeAssignForm({ candidates }: { candidates: Candidate[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [level, setLevel] = useState("TALUKA");
  const [type, setType] = useState("CORE");
  const [designation, setDesignation] = useState("MEMBER");
  const [taluka, setTaluka] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const filtered = query.trim().length >= 1
    ? candidates.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.taluka.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  async function handleAssign() {
    setMessage(null);
    if (!selected) {
      setMessage({ type: "err", text: "Select a family head first." });
      return;
    }
    setLoading(true);
    const res = await assignCommittee({
      userId: selected.userId,
      level, type, designation,
      taluka: level === "TALUKA" ? (taluka || selected.taluka) : "",
    });
    setLoading(false);
    if (res?.error) setMessage({ type: "err", text: res.error });
    else {
      setMessage({ type: "ok", text: `${selected.name} added to committee.` });
      setSelected(null);
      setQuery("");
      setTaluka("");
    }
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[28px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
      <h4 className="!text-[19px] text-[var(--color-bg-secondary)] mb-[18px]">Assign to committee</h4>

      {/* Step 1: pick a family head */}
      {!selected ? (
        <div className="relative">
          <label className="text-[14px] font-medium text-[var(--color-text)] block mb-[8px]">
            Search family head
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a name, village, or email..."
            className="w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
          {filtered.length > 0 && (
            <div className="absolute left-0 right-0 mt-[6px] bg-white rounded-[16px] border border-[#ece5d5] z-20 overflow-hidden" style={{ boxShadow: "rgba(40, 63, 116, 0.12) 0px 8px 30px 0px" }}>
              {filtered.map((c) => (
                <button
                  key={c.userId}
                  onClick={() => { setSelected(c); setTaluka(c.taluka); setQuery(""); }}
                  className="w-full flex items-center gap-[12px] px-[16px] py-[12px] hover:bg-[#faf8f3] text-left cursor-pointer border-b border-[#f3eee2] last:border-b-0"
                >
                  <div className="w-[38px] h-[38px] rounded-[12px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[15px] font-[family-name:var(--font-heading)] shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[15px] text-[var(--color-bg-secondary)] font-medium truncate">{c.name}</div>
                    <div className="text-[13px] text-[var(--color-text-secondary)] truncate">{c.taluka}{c.email ? ` • ${c.email}` : ""}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-[12px] bg-[#faf8f3] border border-[#ece5d5] rounded-[14px] px-[16px] py-[12px] mb-[18px]">
          <div className="min-w-0">
            <div className="text-[15px] font-medium text-[var(--color-bg-secondary)] truncate">{selected.name}</div>
            <div className="text-[13px] text-[var(--color-text-secondary)]">{selected.taluka}</div>
          </div>
          <button onClick={() => setSelected(null)} className="text-[14px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer shrink-0">
            Change
          </button>
        </div>
      )}

      {/* Step 2: committee details */}
      {selected && (
        <div className="flex flex-col gap-[16px]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
            <div>
              <label className="text-[14px] font-medium text-[var(--color-text)] block mb-[8px]">Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] cursor-pointer">
                {LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[14px] font-medium text-[var(--color-text)] block mb-[8px]">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] cursor-pointer">
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[14px] font-medium text-[var(--color-text)] block mb-[8px]">Designation</label>
              <select value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] cursor-pointer">
                {DESIGNATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>

          {level === "TALUKA" && (
            <div>
              <label className="text-[14px] font-medium text-[var(--color-text)] block mb-[8px]">Taluka served</label>
              <select value={taluka} onChange={(e) => setTaluka(e.target.value)} className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] cursor-pointer">
                <option value="">Select taluka</option>
                {TALUKAS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}

          {/* Approval capability hint */}
          <div className="text-[13px] text-[var(--color-text-secondary)] bg-[#cedbf540] border border-[#cedbf5] rounded-[12px] px-[14px] py-[10px]">
            {type === "ADVISOR" || type === "CORE"
              ? "✓ This type can approve membership, marriage permissions, and manage events."
              : "👁 This type can view requests but cannot approve (view-only)."}
          </div>

          {message && (
            <p className={`text-[14px] rounded-[12px] px-[14px] py-[10px] ${message.type === "ok" ? "text-[#0e7a3d] bg-[#18b76015]" : "text-[var(--color-secondary)] bg-[var(--color-secondary)]/8"}`}>
              {message.text}
            </p>
          )}

          <div>
            <Button variant="primary" onClick={handleAssign}>
              {loading ? "Assigning..." : "Assign to committee"}
            </Button>
          </div>
        </div>
      )}

      {message && !selected && (
        <p className={`text-[14px] rounded-[12px] px-[14px] py-[10px] mt-[14px] ${message.type === "ok" ? "text-[#0e7a3d] bg-[#18b76015]" : "text-[var(--color-secondary)] bg-[var(--color-secondary)]/8"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
