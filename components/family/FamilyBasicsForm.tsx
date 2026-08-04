"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { saveFamilyBasics } from "@/app/actions/family";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CURRENT_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
} from "@/lib/constants";

type Props = {
  initial?: {
    familyName?: string;
    taluka?: string;
    villageTown?: string;
    headGender?: string;
    headDob?: string;
    headQualification?: string;
    headOccupation?: string;
    headMaritalStatus?: string;
    headMobile?: string;
    headBloodGroup?: string;
    headCurrentStatus?: string;
  };
};

export default function FamilyBasicsForm({ initial }: Props) {
  const [form, setForm] = useState({
    familyName: initial?.familyName || "",
    taluka: initial?.taluka || "",
    villageTown: initial?.villageTown || "",
    headGender: initial?.headGender || "",
    headDob: initial?.headDob || "",
    headQualification: initial?.headQualification || "",
    headOccupation: initial?.headOccupation || "",
    headMaritalStatus: initial?.headMaritalStatus || "",
    headMobile: initial?.headMobile || "",
    headBloodGroup: initial?.headBloodGroup || "",
    headCurrentStatus: initial?.headCurrentStatus || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setMessage(null);
    if (!form.familyName.trim()) {
      setMessage({ type: "err", text: "Head of Family name is required." });
      return;
    }
    setLoading(true);
    const res = await saveFamilyBasics(form);
    setLoading(false);
    if (res?.error) {
      setMessage({ type: "err", text: res.error });
    } else {
      setMessage({ type: "ok", text: "Family details saved." });
    }
  }

  return (
    <div
      className="bg-white rounded-[31px] border border-[var(--color-border)] p-[30px] sm:p-[40px]"
      style={{ boxShadow: "var(--shadow-elevated)" }}
    >
      <h4 className="!text-[22px] text-[var(--color-bg-secondary)] mb-[6px]">
        Head of Family
      </h4>
      <p className="text-[15px] text-[var(--color-text-secondary)] mb-[24px]">
        Your details as the head of the family.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
        <Input
          id="familyName"
          label="Head of Family — Full Name *"
          value={form.familyName}
          onChange={(e) => update("familyName", e.target.value)}
          placeholder="e.g. Rajesh Kumar Achary"
        />
        <Select
          id="headGender"
          label="Gender"
          options={GENDER_OPTIONS}
          value={form.headGender}
          onChange={(e) => update("headGender", e.target.value)}
        />
        <Input
          id="headDob"
          label="Date of Birth"
          type="date"
          value={form.headDob}
          onChange={(e) => update("headDob", e.target.value)}
        />
        <Select
          id="headMaritalStatus"
          label="Marital Status"
          options={MARITAL_STATUS_OPTIONS}
          value={form.headMaritalStatus}
          onChange={(e) => update("headMaritalStatus", e.target.value)}
        />
        <Input
          id="headQualification"
          label="Qualification"
          value={form.headQualification}
          onChange={(e) => update("headQualification", e.target.value)}
          placeholder="e.g. B.Com"
        />
        <Input
          id="headOccupation"
          label="Occupation"
          value={form.headOccupation}
          onChange={(e) => update("headOccupation", e.target.value)}
          placeholder="e.g. Goldsmith, Business"
        />
        <Select
          id="headCurrentStatus"
          label="Current Status"
          options={CURRENT_STATUS_OPTIONS}
          value={form.headCurrentStatus}
          onChange={(e) => update("headCurrentStatus", e.target.value)}
        />
        <Input
          id="headMobile"
          label="Mobile Number"
          value={form.headMobile}
          onChange={(e) => update("headMobile", e.target.value)}
          placeholder="10-digit mobile"
        />
        <Select
          id="headBloodGroup"
          label="Blood Group"
          options={BLOOD_GROUP_OPTIONS}
          value={form.headBloodGroup}
          onChange={(e) => update("headBloodGroup", e.target.value)}
        />
      </div>

      <div className="h-[1px] bg-[var(--color-border)] my-[26px]" />

      <h4 className="!text-[22px] text-[var(--color-bg-secondary)] mb-[6px]">
        Family Location
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px] mt-[16px]">
        <Input
          id="taluka"
          label="Taluka"
          value={form.taluka}
          onChange={(e) => update("taluka", e.target.value)}
          placeholder="e.g. Aska"
        />
        <Input
          id="villageTown"
          label="Village / Town"
          value={form.villageTown}
          onChange={(e) => update("villageTown", e.target.value)}
          placeholder="e.g. Aska"
        />
      </div>

      {message && (
        <p
          className={`text-[14px] rounded-[12px] px-[14px] py-[10px] mt-[20px] ${
            message.type === "ok"
              ? "text-[#0e7a3d] bg-[#18b76015]"
              : "text-[var(--color-secondary)] bg-[var(--color-secondary)]/8"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-[24px]">
        <Button variant="primary" onClick={handleSave}>
          {loading ? "Saving..." : "Save family details"}
        </Button>
      </div>
    </div>
  );
}
