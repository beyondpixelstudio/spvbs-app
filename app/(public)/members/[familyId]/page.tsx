import Link from "next/link";
import { notFound } from "next/navigation";
import { getFamilyProfile } from "@/lib/directory";
import SharedDocuments from "@/components/directory/SharedDocuments";

function formatDate(d: Date | null): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function FamilyProfilePage({
  params,
}: {
  params: Promise<{ familyId: string }>;
}) {
  const { familyId } = await params;
  const family = await getFamilyProfile(familyId);

  if (!family) notFound();

  const head = family.members.find((m) => m.relation === "Head");
  const others = family.members.filter((m) => m.relation !== "Head");

  return (
    <main className="bg-[#f7f4ee] min-h-screen">
      {/* ===== Header band ===== */}
      <section className="bg-[var(--color-bg-secondary)] relative overflow-hidden">
        <div
          className="absolute -bottom-[160px] -left-[80px] w-[360px] h-[360px] rounded-full opacity-[0.07]"
          style={{ background: "var(--color-primary)" }}
        />
        <div className="max-w-[900px] mx-auto px-[20px] py-[50px] relative">
          <Link
            href="/members"
            className="text-[14px] text-[#cedbf5] hover:text-[var(--color-primary)] transition-colors"
          >
            ← Back to directory
          </Link>

          <div className="flex flex-wrap items-center gap-[22px] mt-[26px]">
            <div className="w-[88px] h-[88px] rounded-[26px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[36px] font-[family-name:var(--font-heading)] shrink-0 ring-4 ring-white/10">
              {family.familyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="!text-[34px] !leading-[1.15] !text-white">
                {family.familyName}
              </h1>
              <p className="text-[16px] text-[#cedbf5] mt-[6px]">
                {family.villageTown}, {family.taluka} Taluka
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-[20px] py-[50px]">
        {/* Head of family */}
        {head && (
          <section className="mb-[40px]">
            <div className="flex items-center gap-[12px] mb-[18px]">
              <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
                Head of Family
              </span>
              <span className="flex-1 h-[1px] bg-[#e5ddcb]" />
            </div>
            <MemberDetailCard member={head} formatDate={formatDate} highlight />
          </section>
        )}

        {/* Other members */}
        {others.length > 0 && (
          <section>
            <div className="flex items-center gap-[12px] mb-[18px]">
              <span className="text-[13px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
                Family Members ({others.length})
              </span>
              <span className="flex-1 h-[1px] bg-[#e5ddcb]" />
            </div>
            <div className="grid grid-cols-1 gap-[18px]">
              {others.map((m) => (
                <MemberDetailCard key={m.id} member={m} formatDate={formatDate} />
              ))}
            </div>
          </section>
        )}

        {others.length === 0 && !head && (
          <p className="text-[16px] text-[var(--color-text-secondary)]">
            No public member details available for this family.
          </p>
        )}
      </div>
    </main>
  );
}

function MemberDetailCard({
  member,
  formatDate,
  highlight = false,
}: {
  member: any;
  formatDate: (d: Date | null) => string;
  highlight?: boolean;
}) {
  const fields = [
    { label: "Gender", value: member.gender },
    { label: "Date of Birth", value: formatDate(member.dob) },
    { label: "Marital Status", value: member.maritalStatus },
    { label: "Qualification", value: member.qualification },
    { label: "Occupation", value: member.occupation },
    { label: "Current Status", value: member.currentStatus },
    { label: "Blood Group", value: member.bloodGroup },
    { label: "Mobile", value: member.mobileNumber },
    { label: "Village/Town", value: member.villageTown },
  ].filter((f) => f.value);

  return (
    <div
      className={`bg-white rounded-[24px] overflow-hidden border ${
        highlight ? "border-[var(--color-primary)]/40" : "border-[#ece5d5]"
      }`}
      style={{
        boxShadow: highlight
          ? "rgba(179, 143, 68, 0.15) 0px 8px 40px 0px"
          : "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px",
      }}
    >
      {/* Card header strip */}
      <div
        className={`flex items-center gap-[16px] px-[28px] py-[20px] ${
          highlight ? "bg-[var(--color-primary)]/8" : "bg-[#faf8f3]"
        }`}
      >
        <div
          className={`w-[52px] h-[52px] rounded-full text-white flex items-center justify-center text-[20px] font-[family-name:var(--font-heading)] ${
            highlight
              ? "bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835]"
              : "bg-[var(--color-bg-secondary)]"
          }`}
        >
          {member.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-[19px] font-medium text-[var(--color-bg-secondary)]">
            {member.fullName}
          </div>
          <div className="text-[14px] text-[var(--color-primary)] font-medium">
            {member.relation}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-[20px] gap-y-[18px] px-[28px] py-[24px]">
        {fields.map((f) => (
          <div key={f.label}>
            <div className="text-[11px] tracking-[0.8px] uppercase text-[var(--color-text-secondary)]">
              {f.label}
            </div>
            <div className="text-[15px] text-[var(--color-text)] mt-[4px]">
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {member.docsSharedWhenLoggedIn && member._count?.privateDocuments > 0 && (
        <div className="px-[28px] pb-[24px]">
          <SharedDocuments
            memberId={member.id}
            memberName={member.fullName}
            docCount={member._count.privateDocuments}
          />
        </div>
      )}
    </div>
  );
}
