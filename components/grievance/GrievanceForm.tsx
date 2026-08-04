"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { submitGrievance } from "@/app/actions/grievance";
import { GRIEVANCE_CATEGORY_OPTIONS } from "@/lib/constants";
import MemberAutocomplete from "./MemberAutocomplete";

// Per-category config: does it show an "against" field, and of what type?
type AgainstMode = "member" | "text" | "none";
const againstConfigMap: Record<string, { mode: AgainstMode; label: string; placeholder: string }> = {
  COMMITTEE: { mode: "member", label: "Which committee member / role? (optional)", placeholder: "Type a name to search..." },
  MEMBER: { mode: "member", label: "Which member? (optional)", placeholder: "Type a name to search..." },
  EVENT: { mode: "text", label: "Which event / function? (optional)", placeholder: "Event or function name..." },
  FINANCIAL: { mode: "member", label: "Related to whom? (optional)", placeholder: "Type a name to search..." },
  SUGGESTION: { mode: "none", label: "", placeholder: "" },
  OTHER: { mode: "none", label: "", placeholder: "" },
};

export default function GrievanceForm() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [againstWhom, setAgainstWhom] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const config = category ? againstConfigMap[category] : null;

  // Category-aware description label
  const descLabel =
    category === "SUGGESTION"
      ? "Your suggestion / feedback *"
      : "Description *";
  const descPlaceholder =
    category === "SUGGESTION"
      ? "Share your suggestion or feedback in detail..."
      : "Describe your grievance in detail...";

  async function handleSubmit() {
    setMessage(null);
    if (!subject.trim() || !description.trim()) {
      setMessage({ type: "err", text: "Please fill in both subject and description." });
      return;
    }
    if (!category) {
      setMessage({ type: "err", text: "Please select a category." });
      return;
    }
    setLoading(true);
    // Only send againstWhom if the category uses it
    const againstToSend = config?.mode === "none" ? "" : againstWhom;
    const res = await submitGrievance({
      subject,
      description,
      category,
      againstWhom: againstToSend,
      anonymous,
    });
    setLoading(false);
    if (res?.error) {
      setMessage({ type: "err", text: res.error });
    } else {
      setMessage({ type: "ok", text: "Submitted successfully." });
      setSubject("");
      setDescription("");
      setCategory("");
      setAgainstWhom("");
      setAnonymous(false);
    }
  }

  return (
    <div
      className="bg-white rounded-[31px] border border-[#ece5d5] p-[30px] sm:p-[36px]"
      style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
    >
      <h4 className="!text-[22px] text-[var(--color-bg-secondary)] mb-[6px]">
        Raise a grievance
      </h4>
      <p className="text-[15px] text-[var(--color-text-secondary)] mb-[24px]">
        Share a concern or suggestion. An admin will review and respond.
      </p>

      <div className="flex flex-col gap-[18px]">
        <Select
          id="category"
          label="Category *"
          options={GRIEVANCE_CATEGORY_OPTIONS}
          placeholder="What is this about?"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setAgainstWhom(""); // reset when category changes
          }}
        />

        {config?.mode === "member" && (
          <MemberAutocomplete
            label={config.label}
            value={againstWhom}
            onChange={setAgainstWhom}
            placeholder={config.placeholder}
          />
        )}

        {config?.mode === "text" && (
          <Input
            id="againstWhom"
            label={config.label}
            value={againstWhom}
            onChange={(e) => setAgainstWhom(e.target.value)}
            placeholder={config.placeholder}
          />
        )}

        <Input
          id="subject"
          label="Subject *"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief title"
        />

        <div className="flex flex-col gap-[8px]">
          <label htmlFor="description" className="text-[15px] font-medium text-[var(--color-text)]">
            {descLabel}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder={descPlaceholder}
            className="w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] resize-y"
          />
        </div>

        <label className="flex items-center gap-[10px] cursor-pointer">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-[18px] h-[18px] accent-[var(--color-primary)] cursor-pointer"
          />
          <span className="text-[15px] text-[var(--color-text)]">
            Submit anonymously (admin won&apos;t see your name)
          </span>
        </label>

        {message && (
          <p
            className={`text-[14px] rounded-[12px] px-[14px] py-[10px] ${
              message.type === "ok"
                ? "text-[#0e7a3d] bg-[#18b76015]"
                : "text-[var(--color-secondary)] bg-[var(--color-secondary)]/8"
            }`}
          >
            {message.text}
          </p>
        )}

        <div>
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
