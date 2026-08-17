"use client";

import { useState, useEffect, useRef } from "react";
import { getDocumentAccessGrants, grantDocumentAccess, revokeDocumentAccess } from "@/app/actions/documents";

type Grant = { id: string; userId: string; name: string; profilePictureUrl: string | null };
type SearchResult = { userId: string; name: string; taluka: string; profilePictureUrl: string | null };

export default function DocumentAccessManager({ memberId }: { memberId: string }) {
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadGrants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  async function loadGrants() {
    const res = await getDocumentAccessGrants(memberId);
    if (res?.success) setGrants(res.grants);
  }

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/family-heads/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
      setSearching(false);
    }, 300);
    return () => timer.current && clearTimeout(timer.current);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSelect(r: SearchResult) {
    setQuery("");
    setResults([]);
    setOpen(false);
    await grantDocumentAccess(memberId, r.userId);
    loadGrants();
  }

  async function handleRevoke(userId: string) {
    await revokeDocumentAccess(memberId, userId);
    loadGrants();
  }

  const grantedIds = new Set((grants || []).map((g) => g.userId));

  return (
    <div className="mt-[16px] pt-[16px] border-t border-[#f0eadd]">
      <div className="text-[13px] font-medium text-[var(--color-text)] mb-[8px]">
        Who can view these documents (besides you)
      </div>

      {/* Selected users */}
      {grants && grants.length > 0 && (
        <div className="flex flex-col gap-[8px] mb-[10px]">
          {grants.map((g) => (
            <div key={g.id} className="flex items-center justify-between gap-[10px] bg-[#faf8f3] border border-[#ece5d5] rounded-[12px] px-[12px] py-[8px]">
              <div className="flex items-center gap-[10px] min-w-0">
                {g.profilePictureUrl ? (
                  <img src={g.profilePictureUrl} alt={g.name} className="w-[28px] h-[28px] rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-[28px] h-[28px] rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[12px] font-medium shrink-0">
                    {g.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[14px] text-[var(--color-text)] truncate">{g.name}</span>
              </div>
              <button
                onClick={() => handleRevoke(g.userId)}
                className="text-[13px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer shrink-0"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Live search */}
      <div className="relative" ref={boxRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Search family heads to grant access..."
          className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[10px] text-[14px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        />
        {open && query.trim().length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-[6px] bg-white rounded-[14px] border border-[#ece5d5] z-30 overflow-hidden max-h-[240px] overflow-y-auto" style={{ boxShadow: "rgba(40, 63, 116, 0.12) 0px 8px 30px 0px" }}>
            {searching ? (
              <div className="px-[14px] py-[12px] text-[13px] text-[var(--color-text-secondary)]">Searching...</div>
            ) : results.length === 0 ? (
              <div className="px-[14px] py-[12px] text-[13px] text-[var(--color-text-secondary)]">No family heads found.</div>
            ) : (
              results
                .filter((r) => !grantedIds.has(r.userId))
                .map((r) => (
                  <button
                    key={r.userId}
                    type="button"
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-[10px] px-[14px] py-[10px] hover:bg-[#faf8f3] text-left cursor-pointer border-b border-[#f3eee2] last:border-b-0"
                  >
                    {r.profilePictureUrl ? (
                      <img src={r.profilePictureUrl} alt={r.name} className="w-[30px] h-[30px] rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[12px] font-medium shrink-0">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[14px] text-[var(--color-bg-secondary)] font-medium truncate">{r.name}</div>
                      <div className="text-[12px] text-[var(--color-text-secondary)]">{r.taluka}</div>
                    </div>
                  </button>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
