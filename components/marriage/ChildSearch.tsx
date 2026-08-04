"use client";

import { useState, useEffect, useRef } from "react";

type Child = { id: string; name: string; age: string; education: string; village: string; eligible?: boolean; father?: string; fatherPhone?: string; fatherVillage?: string };

// Live-search dropdown for selecting a child (son/daughter) from a fetch URL.
export default function ChildSearch({
  label,
  fetchUrl,
  onSelect,
  selected,
  onClear,
  emptyHint,
}: {
  label: string;
  fetchUrl: string | null; // null = disabled (e.g. family not chosen yet)
  onSelect: (child: Child) => void;
  selected: Child | null;
  onClear: () => void;
  emptyHint?: string;
}) {
  const [children, setChildren] = useState<Child[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    if (!fetchUrl) return;
    setLoading(true);
    try {
      const res = await fetch(fetchUrl);
      const data = await res.json();
      setChildren(data.children || []);
    } catch {
      setChildren([]);
    }
    setLoading(false);
    setLoaded(true);
    setOpen(true);
  }

  if (selected) {
    return (
      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[var(--color-text)]">{label} *</label>
        <div className="flex items-center justify-between gap-[12px] bg-[#faf8f3] border border-[#ece5d5] rounded-[12px] px-[14px] py-[11px]">
          <span className="text-[15px] text-[var(--color-bg-secondary)] font-medium">{selected.name}</span>
          <button type="button" onClick={onClear} className="text-[13px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer shrink-0">Change</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[6px] relative">
      <label className="text-[14px] font-medium text-[var(--color-text)]">{label} *</label>
      <button
        type="button"
        onClick={load}
        disabled={!fetchUrl}
        className="text-left rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-primary)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : fetchUrl ? "Click to select" : (emptyHint || "Select the family first")}
      </button>

      {open && loaded && (
        <div className="absolute top-full left-0 right-0 mt-[6px] bg-white rounded-[14px] border border-[#ece5d5] z-30 overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: "rgba(40, 63, 116, 0.12) 0px 8px 30px 0px" }}>
          {children.length === 0 ? (
            <div className="px-[16px] py-[14px] text-[14px] text-[var(--color-text-secondary)]">
              No eligible (unmarried) member found. The family must add them first.
            </div>
          ) : (
            children.map((c) => {
              const eligible = c.eligible !== false;
              return (
              <button
                key={c.id}
                type="button"
                disabled={!eligible}
                onClick={() => { if (eligible) { onSelect(c); setOpen(false); } }}
                className={`w-full text-left px-[16px] py-[11px] border-b border-[#f3eee2] last:border-b-0 ${eligible ? "hover:bg-[#faf8f3] cursor-pointer" : "opacity-60 cursor-not-allowed bg-[#faf8f3]"}`}
              >
                <div className="text-[15px] text-[var(--color-bg-secondary)] font-medium flex items-center gap-[8px]">
                  {c.name}
                  {!eligible && <span className="text-[11px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-[8px] py-[2px] rounded-[40px]">Under 18 — not eligible</span>}
                </div>
                <div className="text-[12px] text-[var(--color-text-secondary)]">
                  {c.age ? `Age ${c.age}` : ""}{c.education ? ` • ${c.education}` : ""}{c.village ? ` • ${c.village}` : ""}
                </div>
              </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
