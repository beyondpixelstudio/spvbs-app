"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function AdminMemberSearch({ initial }: { initial: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const timer = setTimeout(() => {
      router.push(`/admin/members${q.trim() ? "?q=" + encodeURIComponent(q.trim()) : ""}`);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="relative">
      <span className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[18px] text-[var(--color-text-secondary)] pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search families, members, villages, or email..."
        className="w-full rounded-[14px] border border-[var(--color-border)] bg-white pl-[46px] pr-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
      />
    </div>
  );
}
