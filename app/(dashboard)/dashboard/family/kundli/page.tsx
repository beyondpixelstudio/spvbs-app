import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import KundliManager from "@/components/family/KundliManager";

export default async function KundliPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const family = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: {
      members: {
        include: { janamKundli: true },
        orderBy: { relation: "asc" },
      },
    },
  });

  if (!family) {
    return (
      <div>
        <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
          Janam Kundli
        </h2>
        <div className="bg-[#ffc03915] border border-[#ffc03955] rounded-[20px] px-[24px] py-[18px] mt-[20px]">
          <p className="text-[15px] text-[var(--color-text)]">
            💡 Please set up your family first before adding Janam Kundli details.
          </p>
        </div>
      </div>
    );
  }

  const members = family.members.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    relation: m.relation,
    kundli: m.janamKundli
      ? {
          birthDate: m.janamKundli.birthDate
            ? m.janamKundli.birthDate.toISOString().split("T")[0]
            : "",
          birthTime: m.janamKundli.birthTime || "",
          birthPlace: m.janamKundli.birthPlace || "",
          notes:
            m.janamKundli.chartData &&
            typeof m.janamKundli.chartData === "object" &&
            "notes" in m.janamKundli.chartData
              ? String((m.janamKundli.chartData as any).notes)
              : "",
          visibility: m.janamKundli.visibility,
        }
      : null,
  }));

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        Janam Kundli
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[10px]">
        Manage birth details for each family member. You control who can see them.
      </p>
      <div className="bg-[#cedbf540] border border-[#cedbf5] rounded-[16px] px-[18px] py-[12px] mb-[30px]">
        <p className="text-[14px] text-[var(--color-text)]">
          🔒 Janam Kundli is private by default and never shown publicly. You decide
          the visibility for each member.
        </p>
      </div>

      <KundliManager members={members} />
    </div>
  );
}
