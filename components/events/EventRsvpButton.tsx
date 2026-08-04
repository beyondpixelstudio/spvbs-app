"use client";

import { useState } from "react";
import { rsvpEvent } from "@/app/actions/events";

export default function EventRsvpButton({ eventId, initialGoing }: { eventId: string; initialGoing: boolean }) {
  const [going, setGoing] = useState(initialGoing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setError("");
    setLoading(true);
    const res = await rsvpEvent(eventId, going ? "CANCELLED" : "GOING");
    setLoading(false);
    if (res?.error) { setError(res.error); return; }
    setGoing((g) => !g);
  }

  return (
    <div>
      <button
        onClick={toggle}
        disabled={loading}
        className={`rounded-[40px] px-[24px] py-[10px] text-[15px] font-medium transition-all cursor-pointer disabled:opacity-50 ${
          going
            ? "bg-[var(--color-extra-green)] text-white hover:opacity-90"
            : "bg-[var(--color-primary)] text-white hover:opacity-90"
        }`}
      >
        {loading ? "..." : going ? "✓ You're going" : "RSVP — I'll attend"}
      </button>
      {going && !loading && (
        <button onClick={toggle} className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)] ml-[14px] cursor-pointer">
          Cancel RSVP
        </button>
      )}
      {error && <p className="text-[13px] text-[var(--color-secondary)] mt-[8px]">{error}</p>}
    </div>
  );
}
