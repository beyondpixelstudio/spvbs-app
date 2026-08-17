import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FamilyBasicsForm from "@/components/family/FamilyBasicsForm";
import MembersList from "@/components/family/MembersList";
import PendingLock from "@/components/PendingLock";

// Format a Date to YYYY-MM-DD for date inputs
function toDateInput(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().split("T")[0];
}

export default async function FamilyPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.status === "PENDING") {
    return (
      <div>
        <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
          My Family
        </h2>
        <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
          Manage your family details and members.
        </p>
        <PendingLock feature="family management" />
      </div>
    );
  }

  const familyUnit = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: { members: true },
  });

  const deletionRequestsRaw = familyUnit
    ? await prisma.memberDeletionRequest.findMany({
        where: { familyUnitId: familyUnit.id },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];
  const deletionMemberIds = deletionRequestsRaw.map((r) => r.memberId).filter((id): id is string => !!id);
  const deletionMembers = deletionMemberIds.length
    ? await prisma.familyMember.findMany({
        where: { id: { in: deletionMemberIds } },
        select: { id: true, photoUrl: true },
      })
    : [];
  const deletionPhotoMap = Object.fromEntries(deletionMembers.map((m) => [m.id, m.photoUrl]));
  const deletionRequests = deletionRequestsRaw.map((r) => ({
    ...r,
    memberPhoto: r.memberId ? deletionPhotoMap[r.memberId] || null : null,
  }));

  // Extract the Head member (if exists) to pre-fill the basics form
  const head = familyUnit?.members.find((m) => m.relation === "Head");

  const initial = familyUnit
    ? {
        familyName: familyUnit.familyName,
        taluka: familyUnit.taluka,
        villageTown: familyUnit.villageTown,
        headGender: head?.gender || "",
        headDob: toDateInput(head?.dob ?? null),
        headQualification: head?.qualification || "",
        headOccupation: head?.occupation || "",
        headMaritalStatus: head?.maritalStatus || "",
        headMobile: head?.mobileNumber || "",
        headBloodGroup: head?.bloodGroup || "",
        headCurrentStatus: head?.currentStatus || "",
      }
    : undefined;

  // Prepare members for the client list (serialize dates)
  const members =
    familyUnit?.members.map((m) => ({
      id: m.id,
      relation: m.relation,
      fullName: m.fullName,
      gender: m.gender || "",
      dob: toDateInput(m.dob),
      maritalStatus: m.maritalStatus || "",
      qualification: m.qualification || "",
      occupation: m.occupation || "",
      mobileNumber: m.mobileNumber || "",
      bloodGroup: m.bloodGroup || "",
      currentStatus: m.currentStatus || "",
      villageTown: m.villageTown || "",
      visibility: m.visibility,
    })) ?? [];

  return (
    <div>
      <h2 className="!text-[32px] text-[var(--color-bg-secondary)] mb-[6px]">
        My Family
      </h2>
      <p className="text-[16px] text-[var(--color-text-secondary)] mb-[30px]">
        Manage your family details and members.
      </p>

      <div className="flex flex-col gap-[30px]">
        <FamilyBasicsForm initial={initial} />

        {familyUnit ? (
          <div
            className="bg-white rounded-[31px] border border-[var(--color-border)] p-[30px] sm:p-[40px]"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <MembersList members={members} headProfilePictureUrl={user.profilePictureUrl} />
          </div>
        ) : (
          <div className="bg-[#ffc03915] border border-[#ffc03955] rounded-[20px] px-[24px] py-[18px]">
            <p className="text-[15px] text-[var(--color-text)]">
              💡 Save your family details above first — then you can add members.
            </p>
          </div>
        )}

        {deletionRequests.length > 0 && (
          <div
            className="bg-white rounded-[31px] border border-[var(--color-border)] p-[30px] sm:p-[40px]"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <h4 className="!text-[20px] text-[var(--color-bg-secondary)] mb-[16px]">
              Delete/Edit Requests
            </h4>
            <div className="flex flex-col gap-[12px]">
              {deletionRequests.map((r) => {
                const badge =
                  r.status === "APPROVED"
                    ? { label: "Approved", color: "#0e7a3d", bg: "#18b76020" }
                    : r.status === "REJECTED"
                    ? { label: "Rejected", color: "#a11f4a", bg: "#cc336620" }
                    : { label: "Pending Admin Approval", color: "#8a6d1a", bg: "#ffc03920" };
                return (
                  <div key={r.id} className="bg-[#faf8f3] border border-[#ece5d5] rounded-[14px] px-[16px] py-[12px] flex flex-wrap items-center justify-between gap-[10px]">
                    <div className="flex items-center gap-[10px] min-w-0">
                      {r.memberPhoto ? (
                        <img src={r.memberPhoto} alt={r.memberName} className="w-[36px] h-[36px] rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-[36px] h-[36px] rounded-full bg-[var(--color-bg-secondary)] text-white flex items-center justify-center text-[14px] font-medium shrink-0">
                          {r.memberName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-[15px] font-medium text-[var(--color-bg-secondary)]">
                          {r.memberName} <span className="text-[13px] text-[var(--color-text-secondary)] font-normal">({r.relation})</span>
                        </div>
                        {r.status === "REJECTED" && r.rejectionReason && (
                          <div className="text-[13px] text-[var(--color-secondary)] mt-[2px]">Reason: {r.rejectionReason}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-[12px] font-medium px-[12px] py-[5px] rounded-[40px] shrink-0" style={{ color: badge.color, background: badge.bg }}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
