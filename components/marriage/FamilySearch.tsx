"use client";

import { useState, useEffect, useRef } from "react";

type Family = { id: string; familyName: string; taluka: string | null; villageTown: string | null; familyHeadUser?: { profilePictureUrl: string | null } | null };

// Live-search for another family head (by name / taluka / village).
export default function FamilySearch({
  label,
  onSelect,
  selected,
  onClear,
}: {
  label: string;
  onSelect: (fam: Family) => void;
  selected: Family | null;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Family[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<any>(null);

  useEffect(() => {
    if (selected) return;
    if (query.trim().length < 1) { setResults([]); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/marriage/search-families?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.families || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => timer.current && clearTimeout(timer.current);
  }, [query, selected]);

  if (selected) {
    return (
      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[var(--color-text)]">{label} *</label>
        <div className="flex items-center justify-between gap-[12px] bg-[#faf8f3] border border-[#ece5d5] rounded-[12px] px-[14px] py-[11px]">
          <div className="flex items-center gap-[10px] min-w-0">
            {selected.familyHeadUser?.profilePictureUrl ? (
              <img
                src={selected.familyHeadUser.profilePictureUrl}
                alt={selected.familyName}
                className="w-[36px] h-[36px] rounded-[10px] object-cover shrink-0"
              />
            ) : (
              <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[14px] font-[family-name:var(--font-heading)] shrink-0">
                {selected.familyName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-[15px] text-[var(--color-bg-secondary)] font-medium truncate">{selected.familyName}</div>
              <div className="text-[12px] text-[var(--color-text-secondary)]">
                {selected.taluka || ""}{selected.villageTown ? ` • ${selected.villageTown}` : ""}
              </div>
            </div>
          </div>
          <button type="button" onClick={onClear} className="text-[13px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer shrink-0">Change</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[6px] relative">
      <label className="text-[14px] font-medium text-[var(--color-text)]">{label} *</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search family head by name, taluka, or village..."
        className="rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)]"
      />
      {query.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 mt-[6px] bg-white rounded-[14px] border border-[#ece5d5] z-30 overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: "rgba(40, 63, 116, 0.12) 0px 8px 30px 0px" }}>
          {loading ? (
            <div className="px-[16px] py-[14px] text-[14px] text-[var(--color-text-secondary)]">Searching...</div>
          ) : results.length === 0 ? (
            <div className="px-[16px] py-[14px] text-[14px] text-[var(--color-text-secondary)]">No family found.</div>
          ) : (
            results.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelect(f)}
                className="w-full flex items-center gap-[10px] text-left px-[16px] py-[11px] hover:bg-[#faf8f3] cursor-pointer border-b border-[#f3eee2] last:border-b-0"
              >
                {f.familyHeadUser?.profilePictureUrl ? (
                  <img
                    src={f.familyHeadUser.profilePictureUrl}
                    alt={f.familyName}
                    className="w-[32px] h-[32px] rounded-[9px] object-cover shrink-0"
                  />
                ) : (
                  <div className="w-[32px] h-[32px] rounded-[9px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[13px] font-[family-name:var(--font-heading)] shrink-0">
                    {f.familyName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[15px] text-[var(--color-bg-secondary)] font-medium">{f.familyName}</div>
                  <div className="text-[12px] text-[var(--color-text-secondary)]">
                    {f.taluka || ""}{f.villageTown ? ` • ${f.villageTown}` : ""}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
