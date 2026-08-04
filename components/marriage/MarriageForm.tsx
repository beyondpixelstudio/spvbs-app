"use client";

import { useState, useRef } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { submitMarriagePermission } from "@/app/actions/marriage";
import { TALUKAS } from "@/lib/site-config";
import ChildSearch from "@/components/marriage/ChildSearch";
import FamilySearch from "@/components/marriage/FamilySearch";

type Child = { id: string; name: string; age: string; education: string; village: string; father?: string; fatherPhone?: string; fatherVillage?: string };
type Family = { id: string; familyName: string; taluka: string | null; villageTown: string | null };

function FileField({ label, name, required }: { label: string; name: string; required?: boolean }) {
  const [fileName, setFileName] = useState("");
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[14px] font-medium text-[var(--color-text)]">{label}{required ? " *" : ""}</label>
      <label className="flex items-center gap-[10px] rounded-[12px] border border-[#ece5d5] bg-[#faf8f3] px-[14px] py-[10px] text-[14px] text-[var(--color-primary)] cursor-pointer hover:opacity-80">
        📎 {fileName || "Choose image"}
        <input type="file" name={name} accept="image/jpeg,image/png" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} className="hidden" />
      </label>
    </div>
  );
}

// Renders one side's fields. `mode` = "own" (my child) or "other" (other family's child).
function PersonSide({
  side, title, mode, child, onChildSelect, onChildClear,
  family, onFamilySelect, onFamilyClear,
}: {
  side: "groom" | "bride";
  title: string;
  mode: "own" | "other";
  child: Child | null;
  onChildSelect: (c: Child) => void;
  onChildClear: () => void;
  family: Family | null;
  onFamilySelect: (f: Family) => void;
  onFamilyClear: () => void;
}) {
  const relation = side === "groom" ? "Son" : "Daughter";
  const childUrl =
    mode === "own"
      ? `/api/marriage/my-children?relation=${relation}`
      : family
      ? `/api/marriage/family-children?familyId=${family.id}&relation=${relation}`
      : null;

  return (
    <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[24px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
      <div className="bg-[var(--color-secondary)] text-white text-center rounded-[12px] py-[8px] mb-[20px] text-[16px] font-medium">
        {title}
      </div>
      <div className="flex flex-col gap-[14px]">
        {/* Other family: search family head first */}
        {mode === "other" && (
          <FamilySearch label="Family Head" onSelect={onFamilySelect} selected={family} onClear={onFamilyClear} />
        )}

        {/* Name = live-search child */}
        <ChildSearch
          label={side === "groom" ? "Groom (Son)" : "Bride (Daughter)"}
          fetchUrl={childUrl}
          onSelect={onChildSelect}
          selected={child}
          onClear={onChildClear}
          emptyHint={mode === "other" ? "Select the family first" : undefined}
        />

        {/* Hidden field carries the chosen name to the server */}
        <input type="hidden" name={`${side}Name`} value={child?.name || ""} />

        {/* Auto-filled but editable details */}
        <Input id={`${side}Father`} name={`${side}Father`} label="Father's Name" defaultValue={child?.father || ""} key={`fat-${child?.id || "none"}`} />
        <div className="grid grid-cols-2 gap-[12px]">
          <Input id={`${side}Age`} name={`${side}Age`} label="Age" defaultValue={child?.age || ""} key={`age-${child?.id || "none"}`} />
          <Input id={`${side}Education`} name={`${side}Education`} label="Education" defaultValue={child?.education || ""} key={`edu-${child?.id || "none"}`} />
        </div>
        <Input id={`${side}Village`} name={`${side}Village`} label="Address / Village" defaultValue={child?.village || ""} key={`vil-${child?.id || "none"}`} />
        <div className="grid grid-cols-2 gap-[12px]">
          <Input id={`${side}Posa`} name={`${side}Posa`} label="Post" />
          <Input id={`${side}Bhaya`} name={`${side}Bhaya`} label="Bhaya" />
        </div>
        <div className="grid grid-cols-2 gap-[12px]">
          <Input id={`${side}District`} name={`${side}District`} label="District" />
          <Input id={`${side}Phone`} name={`${side}Phone`} label="Phone" defaultValue={child?.fatherPhone || ""} key={`phn-${child?.id || "none"}`} />
        </div>
        <FileField label={`${title} Photo`} name={`${side}Photo`} required />

        {/* Witnesses */}
        <div className="mt-[8px] pt-[14px] border-t border-[#f0eadd]">
          <div className="text-[13px] tracking-[1px] uppercase text-[var(--color-primary)] font-medium mb-[12px]">Witnesses (3)</div>
          <div className="flex flex-col gap-[16px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-[8px]">
                <Input id={`${side}Witness${i}Name`} name={`${side}Witness${i}Name`} label={`Witness ${i} Name *`} />
                <FileField label={`Witness ${i} Signature`} name={`${side}Witness${i}Sig`} required />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarriageForm() {
  const [fillSide, setFillSide] = useState<"groom" | "bride" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Selected children + other family
  const [groomChild, setGroomChild] = useState<Child | null>(null);
  const [brideChild, setBrideChild] = useState<Child | null>(null);
  const [otherFamily, setOtherFamily] = useState<Family | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!formRef.current) return;
    if (!groomChild || !brideChild) {
      setError("Please select both the groom and the bride.");
      return;
    }
    const formData = new FormData(formRef.current);
    setLoading(true);
    const res = await submitMarriagePermission(formData);
    setLoading(false);
    if (res?.error) {
      setError(res.error);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[40px] text-center max-w-[560px] mx-auto" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
        <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-extra-green)]/15 flex items-center justify-center mx-auto mb-[20px] text-[30px]">✓</div>
        <h4 className="!text-[24px] text-[var(--color-bg-secondary)] mb-[12px]">Application submitted</h4>
        <p className="text-[16px] text-[var(--color-text)]">
          Your marriage & negotiation application has been submitted. It requires approval from the taluka committee, central committee, and admin.
        </p>
      </div>
    );
  }

  // Step 1: choose which side you're filling from
  if (!fillSide) {
    return (
      <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[32px] max-w-[620px] mx-auto" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
        <h4 className="!text-[22px] text-[var(--color-bg-secondary)] mb-[8px]">Who are you applying for?</h4>
        <p className="text-[15px] text-[var(--color-text-secondary)] mb-[24px]">
          As a family head, you can apply only for your own son or daughter. Choose your side.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
          <button onClick={() => setFillSide("groom")} className="rounded-[18px] border-2 border-[#ece5d5] hover:border-[var(--color-primary)] p-[24px] text-center cursor-pointer transition-all">
            <div className="text-[34px] mb-[8px]">🤵</div>
            <div className="text-[17px] font-medium text-[var(--color-bg-secondary)]">Groom's Side</div>
            <div className="text-[13px] text-[var(--color-text-secondary)] mt-[4px]">My son is the groom</div>
          </button>
          <button onClick={() => setFillSide("bride")} className="rounded-[18px] border-2 border-[#ece5d5] hover:border-[var(--color-primary)] p-[24px] text-center cursor-pointer transition-all">
            <div className="text-[34px] mb-[8px]">👰</div>
            <div className="text-[17px] font-medium text-[var(--color-bg-secondary)]">Bride's Side</div>
            <div className="text-[13px] text-[var(--color-text-secondary)] mt-[4px]">My daughter is the bride</div>
          </button>
        </div>
      </div>
    );
  }

  // groom side => groom is "own", bride is "other"; bride side => opposite
  const groomMode = fillSide === "groom" ? "own" : "other";
  const brideMode = fillSide === "bride" ? "own" : "other";

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-[12px] mb-[20px] flex-wrap">
        <p className="text-[14px] text-[var(--color-text-secondary)]">
          Applying from: <span className="text-[var(--color-primary)] font-medium">{fillSide === "groom" ? "Groom's Side" : "Bride's Side"}</span>
        </p>
        <button type="button" onClick={() => { setFillSide(null); setGroomChild(null); setBrideChild(null); setOtherFamily(null); }} className="text-[13px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer">
          Change side
        </button>
      </div>

      {error && (
        <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[16px] py-[12px] mb-[20px]">{error}</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        <PersonSide
          side="groom" title="ବର (Groom)" mode={groomMode}
          child={groomChild} onChildSelect={setGroomChild} onChildClear={() => setGroomChild(null)}
          family={groomMode === "other" ? otherFamily : null}
          onFamilySelect={setOtherFamily} onFamilyClear={() => { setOtherFamily(null); setGroomChild(null); }}
        />
        <PersonSide
          side="bride" title="କନ୍ୟା (Bride)" mode={brideMode}
          child={brideChild} onChildSelect={setBrideChild} onChildClear={() => setBrideChild(null)}
          family={brideMode === "other" ? otherFamily : null}
          onFamilySelect={setOtherFamily} onFamilyClear={() => { setOtherFamily(null); setBrideChild(null); }}
        />
      </div>

      {/* Marriage details */}
      <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[24px] mt-[20px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
          <Input id="marriageDate" name="marriageDate" label="Marriage / Nirbandha Date" type="date" />
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-medium text-[var(--color-text)]">Taluka *</label>
            <select name="taluka" required className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] cursor-pointer">
              <option value="">Select taluka</option>
              {TALUKAS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)] mt-[8px]">
          The application will be sent to this taluka&apos;s committee for review.
        </p>
        <div className="flex flex-col gap-[8px] mt-[14px]">
          <label className="text-[14px] font-medium text-[var(--color-text)]">Declaration / Notes</label>
          <textarea name="declaration" rows={3} placeholder="Any declaration or additional notes..." className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] resize-y" />
        </div>
      </div>

      <div className="mt-[24px] flex justify-center">
        <Button variant="primary" type="submit" className="!px-[40px]">
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
