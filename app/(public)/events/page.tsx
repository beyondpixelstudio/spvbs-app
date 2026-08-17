import { prisma } from "@/lib/prisma";
import EventsFilterList from "@/components/events/EventsFilterList";

export default async function EventsPage() {
  const rawEvents = await prisma.event.findMany({
    orderBy: { dateTime: "asc" },
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
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="bg-[var(--color-bg-secondary)] py-[54px] px-[20px]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[14px]">Events & Sammelan</div>
          <h1 className="!text-[38px] !text-white font-[family-name:var(--font-heading)]">Community Events</h1>
          <p className="text-[16px] text-[#cedbf5] mt-[12px]">Gatherings, festivals, and functions of our samaj.</p>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-[20px] py-[44px]">
        <EventsFilterList events={events} />
      </div>
    </div>
  );
}
