"use client";

import { useState } from "react";
import Button from "@/components/Button";
import EventForm from "@/components/events/EventForm";
import { deleteEvent, getEventAttendees, toggleCheckIn } from "@/app/actions/events";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  dateTime: string;
  location: string | null;
  taluka: string | null;
  rsvpCapacity: number | null;
  rsvpCount: number;
};

export default function EventsManager({ events }: { events: EventItem[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [attendanceFor, setAttendanceFor] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [attLoading, setAttLoading] = useState(false);

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.dateTime).getTime() >= now);
  const past = events.filter((e) => new Date(e.dateTime).getTime() < now);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete event "${title}"?`)) return;
    setLoading(true);
    await deleteEvent(id);
    setLoading(false);
  }

  function openEdit(e: EventItem) {
    setEditing(e);
    setShowForm(true);
  }
  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  async function openAttendance(eventId: string) {
    if (attendanceFor === eventId) { setAttendanceFor(null); return; }
    setAttLoading(true);
    setAttendanceFor(eventId);
    const res = await getEventAttendees(eventId);
    setAttendees(res.attendees || []);
    setAttLoading(false);
  }

  async function handleCheckIn(rsvpId: string, checkedIn: boolean) {
    await toggleCheckIn(rsvpId, checkedIn);
    setAttendees((prev) => prev.map((a) => a.rsvpId === rsvpId ? { ...a, checkedIn } : a));
  }

  function EventRow({ e, isPast }: { e: EventItem; isPast?: boolean }) {
    return (
      <div className={`bg-white rounded-[18px] border border-[#ece5d5] p-[20px] ${isPast ? "opacity-70" : ""}`} style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
        <div className="flex items-start justify-between gap-[14px] flex-wrap">
          <div className="min-w-0">
            <h4 className="!text-[18px] text-[var(--color-bg-secondary)]">{e.title}</h4>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
              📅 {fmtDate(e.dateTime)}
              {e.location ? ` • 📍 ${e.location}` : ""}
              {e.taluka ? ` • ${e.taluka}` : ""}
            </p>
            {e.description && <p className="text-[14px] text-[var(--color-text)] mt-[8px] leading-relaxed">{e.description}</p>}
            <p className="text-[13px] text-[var(--color-primary)] mt-[8px] font-medium">
              {e.rsvpCount} RSVP{e.rsvpCount !== 1 ? "s" : ""}{e.rsvpCapacity ? ` / ${e.rsvpCapacity} capacity` : ""}
            </p>
          </div>
          <div className="flex items-center gap-[10px] shrink-0">
            <button onClick={() => openEdit(e)} className="text-[14px] text-[var(--color-primary)] hover:opacity-80 cursor-pointer">Edit</button>
            <button onClick={() => handleDelete(e.id, e.title)} disabled={loading} className="text-[14px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer disabled:opacity-50">Delete</button>
          </div>
        </div>

        {/* Attendance */}
        <div className="mt-[14px] pt-[14px] border-t border-[#f0eadd]">
          <button onClick={() => openAttendance(e.id)} className="text-[14px] text-[var(--color-primary)] font-medium hover:opacity-80 cursor-pointer">
            {attendanceFor === e.id ? "Hide attendance ▲" : "View attendance / check-in ▼"}
          </button>

          {attendanceFor === e.id && (
            <div className="mt-[12px]">
              {attLoading ? (
                <p className="text-[14px] text-[var(--color-text-secondary)]">Loading...</p>
              ) : attendees.length === 0 ? (
                <p className="text-[14px] text-[var(--color-text-secondary)]">No one has RSVP'd yet.</p>
              ) : (
                <div className="flex flex-col gap-[8px]">
                  {attendees.map((a) => (
                    <div key={a.rsvpId} className="flex items-center justify-between gap-[12px] bg-[#faf8f3] border border-[#ece5d5] rounded-[12px] px-[14px] py-[10px]">
                      <div className="min-w-0">
                        <div className="text-[14px] text-[var(--color-bg-secondary)] font-medium truncate">{a.name}</div>
                        <div className="text-[12px] text-[var(--color-text-secondary)]">{a.family}{a.taluka ? ` • ${a.taluka}` : ""}</div>
                      </div>
                      <button
                        onClick={() => handleCheckIn(a.rsvpId, !a.checkedIn)}
                        className={`text-[13px] font-medium px-[14px] py-[6px] rounded-[40px] cursor-pointer shrink-0 ${a.checkedIn ? "bg-[var(--color-extra-green)] text-white" : "border border-[#ece5d5] text-[var(--color-text)] hover:border-[var(--color-primary)]"}`}
                      >
                        {a.checkedIn ? "✓ Present" : "Mark present"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-[12px] mb-[20px] flex-wrap">
        <div className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
          Manage Events
        </div>
        <Button variant="primary" onClick={openNew} className="!py-[9px] !px-[20px] !text-[14px]">+ New Event</Button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[30px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
          <p className="text-[15px] text-[var(--color-text)]">No events yet. Create the first one.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px]">
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-[12px]">
              <div className="text-[12px] tracking-[1px] uppercase text-[var(--color-text-secondary)]">Upcoming</div>
              {upcoming.map((e) => <EventRow key={e.id} e={e} />)}
            </div>
          )}
          {past.length > 0 && (
            <div className="flex flex-col gap-[12px]">
              <div className="text-[12px] tracking-[1px] uppercase text-[var(--color-text-secondary)]">Past</div>
              {past.map((e) => <EventRow key={e.id} e={e} isPast />)}
            </div>
          )}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-[20px]" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-[24px] p-[28px] max-w-[560px] w-full max-h-[90vh] overflow-y-auto" onClick={(ev) => ev.stopPropagation()}>
            <h4 className="!text-[22px] text-[var(--color-bg-secondary)] mb-[20px]">{editing ? "Edit Event" : "New Event"}</h4>
            <EventForm
              event={editing ? {
                id: editing.id,
                title: editing.title,
                description: editing.description || "",
                dateTime: editing.dateTime.slice(0, 16),
                location: editing.location || "",
                taluka: editing.taluka || "",
                rsvpCapacity: editing.rsvpCapacity ? String(editing.rsvpCapacity) : "",
              } : undefined}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
