import { prisma } from "@/lib/prisma";
import AdminMemberControls from "@/components/admin/AdminMemberControls";
import AdminMemberCard from "@/components/admin/AdminMemberCard";

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; taluka?: string }>;
}) {
  const { q, status, taluka } = await searchParams;

  const [families, talukaRows] = await Promise.all([
    prisma.familyUnit.findMany({
      where: {
        ...(status && status !== "ALL"
          ? { familyHeadUser: { status: status as any } }
          : {}),
        ...(taluka ? { taluka } : {}),
        ...(q
          ? {
              OR: [
                { familyName: { contains: q, mode: "insensitive" } },
                { villageTown: { contains: q, mode: "insensitive" } },
                { taluka: { contains: q, mode: "insensitive" } },
                {
                  members: {
                    some: { fullName: { contains: q, mode: "insensitive" } },
                  },
                },
                { familyHeadUser: { email: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        familyHeadUser: { select: { id: true, email: true, status: true } },
        _count: { select: { members: true } },
      },
      orderBy: { familyName: "asc" },
    }),
    prisma.familyUnit.findMany({
      select: { taluka: true },
      distinct: ["taluka"],
      orderBy: { taluka: "asc" },
    }),
  ]);

  const talukas = talukaRows.map((r) => r.taluka).filter(Boolean);

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        Members
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[24px]">
        All registered families. Search by family, member, village, or email.
      </p>

      <AdminMemberControls
        initialQ={q || ""}
        initialStatus={status || "ALL"}
        initialTaluka={taluka || ""}
        talukas={talukas}
      />

      <p className="text-[14px] tracking-[1px] uppercase text-[var(--color-text-secondary)] my-[20px]">
        {families.length} {families.length === 1 ? "Family" : "Families"}
      </p>

      {families.length === 0 ? (
        <div
          className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[36px] text-center"
          style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
        >
          <p className="text-[16px] text-[var(--color-text)]">No families found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[14px]">
          {families.map((f) => (
            <AdminMemberCard
              key={f.id}
              familyId={f.id}
              familyHeadUserId={f.familyHeadUser?.id || ""}
              familyName={f.familyName}
              location={`${f.villageTown}, ${f.taluka}`}
              memberCount={f._count.members}
              email={f.familyHeadUser?.email || "—"}
              status={f.familyHeadUser?.status || "PENDING"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
