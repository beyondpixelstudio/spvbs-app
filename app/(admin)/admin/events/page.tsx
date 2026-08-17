import { prisma } from "@/lib/prisma";
import EventsManager from "@/components/events/EventsManager";

export default async function AdminEventsPage() {
  const rawEvents = await prisma.event.findMany({
    orderBy: { dateTime: "desc" },
  });

  const events = rawEvents.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    dateTime: e.dateTime.toISOString(),
    location: e.location,
    taluka: e.taluka,
  }));

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">Events</h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Create and manage community events, sammelans, and gatherings.
      </p>

      <EventsManager events={events} />
    </div>
  );
}
