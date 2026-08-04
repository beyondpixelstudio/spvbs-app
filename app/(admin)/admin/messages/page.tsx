import { prisma } from "@/lib/prisma";
import MessageCard from "@/components/admin/MessageCard";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">Messages</h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Contact form submissions from the website.
        {unread > 0 && <span className="text-[var(--color-primary)] font-medium"> {unread} unread.</span>}
      </p>

      {messages.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[36px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)]">No messages yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {messages.map((m) => (
            <MessageCard
              key={m.id}
              id={m.id}
              name={m.name}
              taluka={m.taluka}
              village={m.village}
              phone={m.phone}
              email={m.email}
              subject={m.subject}
              message={m.message}
              isRead={m.isRead}
              createdAt={m.createdAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}
