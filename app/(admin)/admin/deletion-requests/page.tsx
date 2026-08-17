import { prisma } from "@/lib/prisma";
import DeletionRequestsManager from "@/components/admin/DeletionRequestsManager";

export default async function DeletionRequestsPage() {
  const requests = await prisma.memberDeletionRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      familyUnit: { select: { familyName: true, taluka: true } },
    },
  });

  const requesterIds = [...new Set(requests.map((r) => r.requestedById))];
  const requesters = await prisma.user.findMany({
    where: { id: { in: requesterIds } },
    select: { id: true, email: true, profilePictureUrl: true, familyUnit: { select: { familyName: true } } },
  });
  const requesterMap = Object.fromEntries(
    requesters.map((u) => [u.id, { name: u.familyUnit?.familyName || u.email || "Unknown", profilePictureUrl: u.profilePictureUrl }])
  );

  const memberIds = requests.map((r) => r.memberId).filter((id): id is string => !!id);
  const membersWithPhoto = memberIds.length
    ? await prisma.familyMember.findMany({
        where: { id: { in: memberIds } },
        select: { id: true, photoUrl: true },
      })
    : [];
  const memberPhotoMap = Object.fromEntries(membersWithPhoto.map((m) => [m.id, m.photoUrl]));

  const items = requests.map((r) => ({
    id: r.id,
    requestType: r.requestType,
    memberName: r.memberName,
    relation: r.relation,
    familyName: r.familyUnit?.familyName || "Unknown",
    taluka: r.familyUnit?.taluka || "",
    status: r.status,
    reason: r.reason,
    rejectionReason: r.rejectionReason,
    proposedChanges: r.proposedChanges as Record<string, string | null> | null,
    requestedByName: requesterMap[r.requestedById]?.name || "Unknown",
    requestedByPhoto: requesterMap[r.requestedById]?.profilePictureUrl || null,
    memberPhoto: r.memberId ? memberPhotoMap[r.memberId] || null : null,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">Delete/Edit Requests</h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Family heads must get approval before a family member is added, edited, or removed.
      </p>

      <DeletionRequestsManager requests={items} />
    </div>
  );
}
