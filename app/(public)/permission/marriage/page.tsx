import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import MarriageForm from "@/components/marriage/MarriageForm";

export default async function MarriagePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      <div className="bg-[var(--color-bg-secondary)] py-[50px] px-[20px]">
        <div className="max-w-[1100px] mx-auto text-center">
          <h1 className="!text-[38px] !text-white font-[family-name:var(--font-heading)]">
            ବିବାହ ও ନିର୍ବନ୍ଧ ଚୁକ୍ତିନାମା
          </h1>
          <p className="text-[18px] text-[#cedbf5] mt-[6px]">Marriage & Negotiation Application</p>
          <p className="text-[14px] text-[#cedbf5]/80 mt-[10px] max-w-[640px] mx-auto">
            Submitted when two families arrange a marriage. Requires approval from the taluka committee, central committee, and admin.
          </p>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-[20px] py-[40px]">
        {!user ? (
          <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[40px] text-center max-w-[520px] mx-auto" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
            <p className="text-[16px] text-[var(--color-text)] mb-[20px]">
              Please log in to submit a marriage & negotiation application.
            </p>
            <Link href="/login" className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white font-medium rounded-[40px] px-[28px] py-[12px] text-[16px] hover:opacity-90">
              Login to continue
            </Link>
          </div>
        ) : (
          <MarriageForm />
        )}
      </div>
    </div>
  );
}
