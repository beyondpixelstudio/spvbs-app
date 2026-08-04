import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DocumentManager from "@/components/family/DocumentManager";

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const family = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: {
      members: {
        include: {
          privateDocuments: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { relation: "asc" },
      },
    },
  });

  if (!family) {
    return (
      <div>
        <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
          Private Documents
        </h2>
        <div className="bg-[#ffc03915] border border-[#ffc03955] rounded-[20px] px-[24px] py-[18px] mt-[20px]">
          <p className="text-[15px] text-[var(--color-text)]">
            💡 Please set up your family first before adding documents.
          </p>
        </div>
      </div>
    );
  }

  const members = family.members.map((m) => ({
    id: m.id,
    fullName: m.fullName,
    relation: m.relation,
    hasPassword: !!m.docsPasswordEnc,
    shared: m.docsSharedWhenLoggedIn,
    documents: m.privateDocuments.map((d) => ({
      id: d.id,
      docType: d.docType,
      fileName: d.fileName,
    })),
  }));

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        Private Documents
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[10px]">
        Securely store documents for each family member, protected by a password.
      </p>
      <div className="bg-[#cedbf540] border border-[#cedbf5] rounded-[16px] px-[18px] py-[12px] mb-[30px]">
        <p className="text-[14px] text-[var(--color-text)]">
          🔒 Each member has one password that unlocks all their documents. Set a
          password, then choose whether to share access with other logged-in members.
        </p>
      </div>

      <DocumentManager members={members} />
    </div>
  );
}
