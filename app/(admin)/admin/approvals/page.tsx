import { prisma } from "@/lib/prisma";
import ApprovalCard from "@/components/admin/ApprovalCard";

export default async function ApprovalsPage() {
  const [pending, suspended] = await Promise.all([
    prisma.user.findMany({
      where: { role: "FAMILY_HEAD", status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "FAMILY_HEAD", status: "SUSPENDED" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  async function withFamily(users: typeof pending) {
    return Promise.all(
      users.map(async (u) => {
        const family = await prisma.familyUnit.findUnique({
          where: { familyHeadUserId: u.id },
          include: {
            _count: { select: { members: true } },
            members: { where: { relation: "Head" }, take: 1 },
          },
        });
        const head = family?.members?.[0] || null;

        // Prefer explicit family/head values; fall back gracefully
        const name =
          family?.familyName ||
          head?.fullName ||
          "(Details not submitted yet)";

        const villageTown = family?.villageTown || head?.villageTown || "";
        const taluka = family?.taluka || "";
        const location =
          villageTown && taluka
            ? `${villageTown}, ${taluka}`
            : villageTown || taluka || "—";

        const mobile = head?.mobileNumber || "";

        return {
          user: u,
          name,
          location,
          mobile,
          memberCount: family?._count.members ?? 0,
          profilePictureUrl: u.profilePictureUrl,
        };
      })
    );
  }

  const [pendingList, suspendedList] = await Promise.all([
    withFamily(pending),
    withFamily(suspended),
  ]);

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        Approvals
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Review new membership requests before they appear in the Members list.
      </p>

      {/* Pending */}
      <section className="mb-[40px]">
        <div className="flex items-center gap-[12px] mb-[18px]">
          <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
            Pending ({pendingList.length})
          </span>
          <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
        </div>

        {pendingList.length === 0 ? (
          <div className="bg-[var(--color-border)] rounded-[20px] px-[24px] py-[30px] text-center">
            <p className="text-[16px] text-[var(--color-text)]">
              No pending requests. All caught up ✓
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {pendingList.map((item) => (
              <ApprovalCard
                key={item.user.id}
                userId={item.user.id}
                email={item.user.email || "—"}
                familyName={item.name}
                location={item.location}
                mobile={item.mobile}
                memberCount={item.memberCount}
                profilePictureUrl={item.profilePictureUrl}
                variant="pending"
              />
            ))}
          </div>
        )}
      </section>

      {/* Suspended / rejected */}
      {suspendedList.length > 0 && (
        <section>
          <div className="flex items-center gap-[12px] mb-[18px]">
            <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-secondary)] font-medium">
              Suspended ({suspendedList.length})
            </span>
            <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
          </div>
          <div className="flex flex-col gap-[16px]">
            {suspendedList.map((item) => (
              <ApprovalCard
                key={item.user.id}
                userId={item.user.id}
                email={item.user.email || "—"}
                familyName={item.name}
                location={item.location}
                mobile={item.mobile}
                memberCount={item.memberCount}
                profilePictureUrl={item.profilePictureUrl}
                variant="suspended"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
