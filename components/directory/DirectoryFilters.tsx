"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function DirectoryFilters({ talukas }: { talukas: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [taluka, setTaluka] = useState(searchParams.get("taluka") || "");

  // Track whether the user has interacted, so we don't push on first mount
  const isFirstRender = useRef(true);

  function buildUrl(newSearch: string, newTaluka: string) {
    const params = new URLSearchParams();
    if (newSearch.trim()) params.set("search", newSearch.trim());
    if (newTaluka) params.set("taluka", newTaluka);
    return `/members${params.toString() ? "?" + params.toString() : ""}`;
  }

  // Debounced live search: waits 300ms after typing stops
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      router.push(buildUrl(search, taluka));
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, taluka]);

  function clearAll() {
    setSearch("");
    setTaluka("");
  }

  return (
    <div className="flex flex-col sm:flex-row gap-[12px] mb-[30px]">
      {/* Search (live) */}
      <div className="flex-1 relative">
        <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[18px] text-[var(--color-text-secondary)] pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, family, or village..."
          className="w-full rounded-[14px] border border-[var(--color-border)] bg-white pl-[46px] pr-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Taluka filter */}
      <select
        value={taluka}
        onChange={(e) => setTaluka(e.target.value)}
        className="rounded-[14px] border border-[var(--color-border)] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] cursor-pointer"
      >
        <option value="">All Talukas</option>
        {talukas.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {(search || taluka) && (
        <button
          onClick={clearAll}
          className="text-[15px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer px-[10px]"
        >
          Clear
        </button>
      )}
    </div>
  );
}
