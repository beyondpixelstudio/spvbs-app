import Link from "next/link";
import ProfilePictureUpload from "@/components/profile/ProfilePictureUpload";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const statusBadge: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pending Approval", color: "#8a6d1a", bg: "#ffc03920" },
  APPROVED: { label: "Approved", color: "#0e7a3d", bg: "#18b76020" },
  SUSPENDED: { label: "Suspended", color: "#a11f4a", bg: "#cc336620" },
};

export default async function DashboardOverview() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Display name from auth metadata
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  const name =
    (authUser?.user_metadata?.full_name as string) || user.email || "Member";

  // Does this user already have a family unit set up?
  const familyUnit = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: { members: true },
  });

  // Committee positions held by this user
  const committee = await prisma.committeeAssignment.findMany({
    where: { userId: user.id },
  });
  const levelText: Record<string, string> = { TALUKA: "Taluka", CENTRAL: "Central" };
  const typeText: Record<string, string> = {
    ADVISOR: "Advisor", CORE: "Core Committee", FINANCE: "Finance",
    MANDIR_PARICHALANA: "Mandir Parichalana", YOUTH_CELL: "Youth Cell",
  };
  const desigText: Record<string, string> = {
    PRESIDENT: "President", SECRETARY: "Secretary", JOINT_SECRETARY: "Joint Secretary",
    CASHIER: "Cashier", MEMBER: "Member",
  };

  const badge = statusBadge[user.status] ?? statusBadge.PENDING;

  return (
    <div>
      <div className="mb-[24px]">
        <ProfilePictureUpload currentUrl={user.profilePictureUrl} />
      </div>
      {/* Roles & Responsibilities */}
      {(familyUnit || committee.length > 0 || user.role === "SUPER_ADMIN" || user.role === "TALUKA_ADMIN") && (
        <div className="bg-[var(--color-bg-secondary)] rounded-[20px] p-[24px] mb-[24px]">
          <div className="text-[12px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium mb-[12px]">
            Your Roles & Responsibilities
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {/* Family Head */}
            {familyUnit && (
              <div className="bg-white/10 rounded-[14px] px-[16px] py-[10px]">
                <div className="text-[15px] font-medium text-white">Family Head</div>
                <div className="text-[13px] text-[#cedbf5]">
                  {familyUnit.familyName}
                  {familyUnit.taluka ? ` • ${familyUnit.taluka}` : ""}
                  {familyUnit.villageTown ? ` • ${familyUnit.villageTown}` : ""}
                </div>
              </div>
            )}

            {/* Super/Taluka Admin */}
            {user.role === "SUPER_ADMIN" && (
              <div className="bg-white/10 rounded-[14px] px-[16px] py-[10px]">
                <div className="text-[15px] font-medium text-white">Super Admin</div>
                <div className="text-[13px] text-[#cedbf5]">Full platform access</div>
              </div>
            )}
            {user.role === "TALUKA_ADMIN" && (
              <div className="bg-white/10 rounded-[14px] px-[16px] py-[10px]">
                <div className="text-[15px] font-medium text-white">Taluka Admin</div>
                <div className="text-[13px] text-[#cedbf5]">
                  {familyUnit?.taluka || "Taluka"} administration
                </div>
              </div>
            )}

            {/* Committee positions */}
            {committee.map((c) => (
              <div key={c.id} className="bg-white/10 rounded-[14px] px-[16px] py-[10px]">
                <div className="text-[15px] font-medium text-white">
                  {desigText[c.designation] || c.designation}
                </div>
                <div className="text-[13px] text-[#cedbf5]">
                  {levelText[c.level] || c.level} • {typeText[c.type] || c.type}
                  {c.taluka ? ` • ${c.taluka}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-[16px] mb-[30px]">
        <div>
          <h2 className="!text-[32px] text-[var(--color-bg-secondary)]">
            Namaste, {name.split(" ")[0]} 🙏
          </h2>
          <p className="text-[16px] text-[var(--color-text-secondary)] mt-[4px]">
            Welcome to your family dashboard.
          </p>
        </div>
        <span
          className="text-[14px] font-medium px-[16px] py-[8px] rounded-[40px]"
          style={{ color: badge.color, background: badge.bg }}
        >
          {badge.label}
        </span>
      </div>

      {/* Pending notice */}
      {user.status === "PENDING" && (
        <div className="bg-[#ffc03915] border border-[#ffc03955] rounded-[20px] px-[24px] py-[20px] mb-[30px]">
          <p className="text-[15px] text-[var(--color-text)]">
            <strong>Your registration is under review.</strong> You can set up your
            family details now — they&apos;ll go live in the directory once an admin
            approves your account.
          </p>
        </div>
      )}

      {/* Family setup card */}
      {!familyUnit ? (
        <div
          className="bg-white rounded-[31px] border border-[var(--color-border)] p-[40px] text-center"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          <div className="text-[44px] mb-[16px]">👨‍👩‍👧‍👦</div>
          <h4 className="!text-[24px] text-[var(--color-bg-secondary)] mb-[10px]">
            Set up your family
          </h4>
          <p className="text-[16px] text-[var(--color-text)] max-w-[440px] mx-auto mb-[26px]">
            Start by adding your family details and members. This creates your
            listing in the community directory.
          </p>
          <Link
            href="/dashboard/family"
            className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-medium rounded-[40px] px-[30px] py-[14px] text-[18px] hover:opacity-90 transition-all"
          >
            Set up my family
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px]">
          <div
            className="bg-white rounded-[24px] border border-[var(--color-border)] p-[26px]"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <div className="text-[14px] text-[var(--color-text-secondary)]">
              Family Name
            </div>
            <div className="text-[22px] font-[family-name:var(--font-heading)] text-[var(--color-bg-secondary)] mt-[6px]">
              {familyUnit.familyName}
            </div>
          </div>
          <div
            className="bg-white rounded-[24px] border border-[var(--color-border)] p-[26px]"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <div className="text-[14px] text-[var(--color-text-secondary)]">
              Members
            </div>
            <div className="text-[22px] font-[family-name:var(--font-heading)] text-[var(--color-primary)] mt-[6px]">
              {familyUnit.members.length}
            </div>
          </div>
          <Link
            href="/dashboard/family"
            className="bg-[var(--color-bg-secondary)] rounded-[24px] p-[26px] flex flex-col justify-center hover:opacity-95 transition-opacity"
          >
            <div className="text-[16px] text-white font-medium">
              Manage family →
            </div>
            <div className="text-[13px] text-[#cedbf5] mt-[4px]">
              Add or edit members
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
