"use client";

import { useState, useEffect, useRef } from "react";

type Result = {
  id: string;
  name: string;
  relation: string;
  location: string;
};

export default function MemberAutocomplete({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/members/search?q=${encodeURIComponent(value.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectResult(r: Result) {
    onChange(r.name);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-[8px] relative" ref={boxRef}>
      <label className="text-[15px] font-medium text-[var(--color-text)]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => value.trim().length >= 2 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]"
      />

      {open && value.trim().length >= 2 && (
        <div
          className="absolute top-full left-0 right-0 mt-[6px] bg-white rounded-[16px] border border-[#ece5d5] z-50 overflow-hidden max-h-[280px] overflow-y-auto"
          style={{ boxShadow: "rgba(40, 63, 116, 0.12) 0px 8px 30px 0px" }}
        >
          {loading ? (
            <div className="px-[16px] py-[14px] text-[14px] text-[var(--color-text-secondary)]">
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => selectResult(r)}
                className="w-full flex items-center gap-[12px] px-[16px] py-[12px] hover:bg-[#faf8f3] transition-colors text-left cursor-pointer border-b border-[#f3eee2] last:border-b-0"
              >
                <div className="w-[38px] h-[38px] rounded-[12px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[15px] font-[family-name:var(--font-heading)] shrink-0">
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] text-[var(--color-bg-secondary)] font-medium truncate">
                    {r.name}
                  </div>
                  <div className="text-[13px] text-[var(--color-text-secondary)] truncate">
                    {r.relation}
                    {r.location ? ` • ${r.location}` : ""}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-[16px] py-[14px] text-[14px] text-[var(--color-text-secondary)]">
              No match — &quot;{value}&quot; will be used as typed.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
