import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EventRsvpButton from "@/components/events/EventRsvpButton";

export default async function EventsPage() {
  const user = await getCurrentUser();

  const rawEvents = await prisma.event.findMany({
    include: { _count: { select: { rsvps: true } } },
    orderBy: { dateTime: "asc" },
  });

  const now = Date.now();
  const upcoming = rawEvents.filter((e) => new Date(e.dateTime).getTime() >= now);
  const past = rawEvents.filter((e) => new Date(e.dateTime).getTime() < now);

  // If logged in, find which events this user's family members have RSVP'd to
  let myRsvps: Record<string, boolean> = {};
  let myMemberId: string | null = null;
  if (user) {
    const family = await prisma.familyUnit.findUnique({
      where: { familyHeadUserId: user.id },
      include: { members: { where: { relation: "Head" }, take: 1 } },
    });
    myMemberId = family?.members?.[0]?.id || null;
    if (myMemberId) {
      const rsvps = await prisma.eventRSVP.findMany({ where: { memberId: myMemberId } });
      myRsvps = Object.fromEntries(rsvps.map((r) => [r.eventId, true]));
    }
  }

  const fmtDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  function EventCard({ e, isPast }: { e: typeof rawEvents[number]; isPast?: boolean }) {
    return (
      <div className={`bg-white rounded-[24px] border border-[#ece5d5] p-[28px] ${isPast ? "opacity-70" : ""}`} style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
        <div className="flex items-start justify-between gap-[16px] flex-wrap">
          <div className="min-w-0 flex-1">
            <h3 className="!text-[24px] text-[var(--color-bg-secondary)] font-[family-name:var(--font-heading)]">{e.title}</h3>
            <p className="text-[14px] text-[var(--color-primary)] font-medium mt-[6px]">📅 {fmtDate(e.dateTime)}</p>
            {e.location && <p className="text-[14px] text-[var(--color-text-secondary)] mt-[2px]">📍 {e.location}{e.taluka ? `, ${e.taluka}` : ""}</p>}
            {e.description && <p className="text-[15px] text-[var(--color-text)] mt-[12px] leading-relaxed">{e.description}</p>}
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-[12px]">
              {e._count.rsvps} attending{e.rsvpCapacity ? ` • ${e.rsvpCapacity} capacity` : ""}
            </p>
          </div>
        </div>
        {!isPast && (
          <div className="mt-[18px] pt-[18px] border-t border-[#f0eadd]">
            {user && myMemberId ? (
              <EventRsvpButton eventId={e.id} initialGoing={!!myRsvps[e.id]} />
            ) : (
              <p className="text-[14px] text-[var(--color-text-secondary)]">
                <a href="/login" className="text-[var(--color-primary)] font-medium hover:opacity-80">Log in</a> to RSVP for this event.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="bg-[var(--color-bg-secondary)] py-[54px] px-[20px]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[14px]">Events & Sammelan</div>
          <h1 className="!text-[38px] !text-white font-[family-name:var(--font-heading)]">Community Events</h1>
          <p className="text-[16px] text-[#cedbf5] mt-[12px]">Gatherings, festivals, and functions of our samaj.</p>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-[20px] py-[44px]">
        {upcoming.length === 0 && past.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-[#ece5d5] px-[24px] py-[40px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
            <p className="text-[16px] text-[var(--color-text)]">No events scheduled yet. Check back soon.</p>
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
    </div>
  );
}
