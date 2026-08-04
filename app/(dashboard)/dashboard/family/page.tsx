import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import FamilyBasicsForm from "@/components/family/FamilyBasicsForm";
import MembersList from "@/components/family/MembersList";

// Format a Date to YYYY-MM-DD for date inputs
function toDateInput(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().split("T")[0];
}

export default async function FamilyPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const familyUnit = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: { members: true },
  });

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
            <MembersList members={members} />
          </div>
        ) : (
          <div className="bg-[#ffc03915] border border-[#ffc03955] rounded-[20px] px-[24px] py-[18px]">
            <p className="text-[15px] text-[var(--color-text)]">
              💡 Save your family details above first — then you can add members.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
