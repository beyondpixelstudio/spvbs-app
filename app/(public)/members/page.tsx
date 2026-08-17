import Link from "next/link";
import { getDirectoryFamilies } from "@/lib/directory";
import { TALUKAS } from "@/lib/site-config";
import DirectoryFilters from "@/components/directory/DirectoryFilters";

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; taluka?: string }>;
}) {
  const params = await searchParams;
  const talukas = TALUKAS;
  const [families] = await Promise.all([
    getDirectoryFamilies({ search: params.search, taluka: params.taluka }),
  ]);

  return (
    <main className="bg-[#f7f4ee] min-h-screen">
      {/* ===== Elegant header band ===== */}
      <section className="bg-[var(--color-bg-secondary)] relative overflow-hidden">
        <div
          className="absolute -top-[140px] -right-[100px] w-[380px] h-[380px] rounded-full opacity-[0.08]"
          style={{ background: "var(--color-primary)" }}
        />
        <div className="max-w-[1200px] mx-auto px-[20px] py-[70px] relative">
          <span className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)]">
            Our Community
          </span>
          <h1 className="!text-[42px] sm:!text-[52px] !leading-[1.1] !text-white mt-[14px] max-w-[620px]">
            Members
          </h1>
          <p className="text-[18px] text-[#cedbf5] mt-[16px] max-w-[520px]">
            Browse the family heads that make up our samaj — search by name, village,
            or taluka.
          </p>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-[20px] py-[50px]">
        {/* Filters */}
        <DirectoryFilters talukas={talukas} />

        {/* Results count */}
        <p className="text-[14px] tracking-[1px] uppercase text-[var(--color-text-secondary)] mb-[24px]">
          {families.length} {families.length === 1 ? "Family" : "Families"}
        </p>

        {/* Family cards */}
        {families.length === 0 ? (
          <div className="text-center py-[90px]">
            <div className="text-[40px] mb-[16px] opacity-40">🔍</div>
            <p className="text-[18px] text-[var(--color-text)]">
              No families match your search.
            </p>
            <p className="text-[15px] text-[var(--color-text-secondary)] mt-[6px]">
              Try a different name or clear the filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {(families as any[]).map((family) => {
              const head = family.members.find((m: any) => m.relation === "Head");
              const memberCount = family.members.length;
              return (
                <Link
                  key={family.id}
                  href={`/members/${family.id}`}
                  className="group relative bg-white rounded-[24px] border border-[#ece5d5] p-[28px] transition-all duration-300 hover:-translate-y-[5px] hover:border-[var(--color-primary)]/40 hover:shadow-[rgba(179,143,68,0.18)_0px_14px_44px_0px] overflow-hidden"
                  style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
                >
                  {/* top accent line that grows on hover */}
                  <span className="absolute top-0 left-0 h-[3px] w-0 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />

                  <div className="flex items-start gap-[16px]">
                    {family.familyHeadUser?.profilePictureUrl ? (
                      <img
                        src={family.familyHeadUser.profilePictureUrl}
                        alt={family.familyName}
                        className="w-[58px] h-[58px] rounded-[18px] object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-[58px] h-[58px] rounded-[18px] bg-gradient-to-br from-[var(--color-primary)] to-[#9a7835] text-white flex items-center justify-center text-[24px] font-[family-name:var(--font-heading)] shrink-0">
                        {family.familyName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 pt-[2px]">
                      <h4 className="!text-[19px] !leading-[1.25] text-[var(--color-bg-secondary)] truncate">
                        {family.familyName}
                      </h4>
                      <p className="text-[14px] text-[var(--color-text-secondary)] mt-[3px]">
                        {family.villageTown}, {family.taluka}
                      </p>
                    </div>
                  </div>

                  {head?.occupation && (
                    <div className="mt-[18px] inline-flex items-center gap-[6px] text-[14px] text-[var(--color-text)] bg-[#faf8f3] border border-[#ece5d5] rounded-[40px] px-[14px] py-[6px]">
                      {head.occupation}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-[22px] pt-[16px] border-t border-[#f0eaddd]">
                    <span className="text-[13px] tracking-[0.5px] text-[var(--color-text-secondary)]">
                      {memberCount} {memberCount === 1 ? "member" : "members"}
                    </span>
                    <span className="text-[15px] text-[var(--color-primary)] font-medium inline-flex items-center gap-[4px] transition-transform group-hover:translate-x-[3px]">
                      View profile →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
