"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import {
  RELATION_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CURRENT_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  VISIBILITY_OPTIONS,
} from "@/lib/constants";
import { addFamilyMember, updateFamilyMember } from "@/app/actions/family";

export type MemberData = {
  id?: string;
  relation: string;
  fullName: string;
  gender?: string;
  dob?: string;
  maritalStatus?: string;
  qualification?: string;
  occupation?: string;
  mobileNumber?: string;
  bloodGroup?: string;
  currentStatus?: string;
  villageTown?: string;
  visibility?: string;
};

export default function MemberFormModal({
  member,
  onClose,
}: {
  member?: MemberData;
  onClose: () => void;
}) {
  const isEdit = !!member?.id;
  const [form, setForm] = useState<MemberData>({
    relation: member?.relation || "",
    fullName: member?.fullName || "",
    gender: member?.gender || "",
    dob: member?.dob || "",
    maritalStatus: member?.maritalStatus || "",
    qualification: member?.qualification || "",
    occupation: member?.occupation || "",
    mobileNumber: member?.mobileNumber || "",
    bloodGroup: member?.bloodGroup || "",
    currentStatus: member?.currentStatus || "",
    villageTown: member?.villageTown || "",
    visibility: member?.visibility || "MEMBERS_ONLY",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(key: keyof MemberData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    setError("");
    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!form.relation) {
      setError("Please select a relation.");
      return;
    }
    setLoading(true);
    const res = isEdit
      ? await updateFamilyMember(member!.id!, form)
      : await addFamilyMember(form);
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] bg-black/40">
      <div
        className="bg-white rounded-[31px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-[30px] sm:p-[36px]"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        <div className="flex items-center justify-between mb-[20px]">
          <h4 className="!text-[22px] text-[var(--color-bg-secondary)]">
            {isEdit ? "Edit member" : "Add family member"}
          </h4>
          <button
            onClick={onClose}
            className="text-[24px] text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)] cursor-pointer leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
          <Select
            id="relation"
            label="Relation *"
            options={RELATION_OPTIONS}
            value={form.relation}
            onChange={(e) => update("relation", e.target.value)}
          />
          <Input
            id="fullName"
            label="Full Name *"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
          <Select
            id="gender"
            label="Gender"
            options={GENDER_OPTIONS}
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
          />
          <Input
            id="dob"
            label="Date of Birth"
            type="date"
            value={form.dob}
            onChange={(e) => update("dob", e.target.value)}
          />
          <Select
            id="maritalStatus"
            label="Marital Status"
            options={MARITAL_STATUS_OPTIONS}
            value={form.maritalStatus}
            onChange={(e) => update("maritalStatus", e.target.value)}
          />
          <Input
            id="qualification"
            label="Qualification"
            value={form.qualification}
            onChange={(e) => update("qualification", e.target.value)}
          />
          <Input
            id="occupation"
            label="Occupation"
            value={form.occupation}
            onChange={(e) => update("occupation", e.target.value)}
          />
          <Select
            id="currentStatus"
            label="Current Status"
            options={CURRENT_STATUS_OPTIONS}
            value={form.currentStatus}
            onChange={(e) => update("currentStatus", e.target.value)}
          />
          <Input
            id="mobileNumber"
            label="Mobile Number"
            value={form.mobileNumber}
            onChange={(e) => update("mobileNumber", e.target.value)}
          />
          <Select
            id="bloodGroup"
            label="Blood Group"
            options={BLOOD_GROUP_OPTIONS}
            value={form.bloodGroup}
            onChange={(e) => update("bloodGroup", e.target.value)}
          />
          <Input
            id="villageTown"
            label="Village / Town"
            value={form.villageTown}
            onChange={(e) => update("villageTown", e.target.value)}
          />
          <Select
            id="visibility"
            label="Visibility"
            options={VISIBILITY_OPTIONS}
            placeholder="Members only"
            value={form.visibility}
            onChange={(e) => update("visibility", e.target.value)}
          />
        </div>

        {error && (
          <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px] mt-[18px]">
            {error}
          </p>
        )}

        <div className="flex gap-[12px] mt-[24px]">
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? "Saving..." : isEdit ? "Save changes" : "Add member"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
