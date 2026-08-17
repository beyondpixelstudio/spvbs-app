"use client";

import { useState, useMemo } from "react";
import { TALUKAS } from "@/lib/site-config";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  dateTime: string;
  location: string | null;
  taluka: string | null;
};

export default function EventsFilterList({ events }: { events: EventItem[] }) {
  const [search, setSearch] = useState("");
  const [taluka, setTaluka] = useState("ALL");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (taluka !== "ALL" && e.taluka !== taluka) return false;
      if (q) {
        const haystack = `${e.title} ${e.location || ""} ${e.taluka || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [events, search, taluka]);

  const now = Date.now();
  const upcoming = filtered.filter((e) => new Date(e.dateTime).getTime() >= now);
  const past = filtered.filter((e) => new Date(e.dateTime).getTime() < now);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  function EventCard({ e, isPast }: { e: EventItem; isPast?: boolean }) {
    return (
      <div className={`bg-white rounded-[24px] border border-[#ece5d5] p-[28px] ${isPast ? "opacity-70" : ""}`} style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
        <div className="flex items-start justify-between gap-[16px] flex-wrap">
          <div className="min-w-0 flex-1">
            <h3 className="!text-[24px] text-[var(--color-bg-secondary)] font-[family-name:var(--font-heading)]">{e.title}</h3>
            <p className="text-[14px] text-[var(--color-primary)] font-medium mt-[6px]">📅 {fmtDate(e.dateTime)}</p>
            {e.location && <p className="text-[14px] text-[var(--color-text-secondary)] mt-[2px]">📍 {e.location}{e.taluka ? `, ${e.taluka}` : ""}</p>}
            {e.description && <p className="text-[15px] text-[var(--color-text)] mt-[12px] leading-relaxed">{e.description}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search + Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-[30px]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by name or location..."
          className="w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
        />
        <select
          value={taluka}
          onChange={(e) => setTaluka(e.target.value)}
          className="w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] cursor-pointer"
        >
          <option value="ALL">All Talukas</option>
          {TALUKAS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="bg-white rounded-[24px] border border-[#ece5d5] px-[24px] py-[40px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)]">
            {events.length === 0 ? "No events scheduled yet. Check back soon." : "No events match your search or filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[30px]">
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-[18px]">
              <div className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">Upcoming</div>
              {upcoming.map((e) => <EventCard key={e.id} e={e} />)}
            </div>
          )}
          {past.length > 0 && (
            <div className="flex flex-col gap-[18px]">
              <div className="text-[13px] tracking-[2px] uppercase text-[var(--color-text-secondary)] font-medium">Past Events</div>
              {past.map((e) => <EventCard key={e.id} e={e} isPast />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
