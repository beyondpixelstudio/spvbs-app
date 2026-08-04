"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { saveKundli, deleteKundli } from "@/app/actions/kundli";
import { VISIBILITY_OPTIONS } from "@/lib/constants";

type KundliData = {
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  notes: string;
  visibility: string;
};

type Member = {
  id: string;
  fullName: string;
  relation: string;
  kundli: KundliData | null;
};

function MemberKundli({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<KundliData>({
    birthDate: member.kundli?.birthDate || "",
    birthTime: member.kundli?.birthTime || "",
    birthPlace: member.kundli?.birthPlace || "",
    notes: member.kundli?.notes || "",
    visibility: member.kundli?.visibility || "HIDDEN",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const hasKundli = !!member.kundli;

  function update(key: keyof KundliData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setMessage(null);
    setLoading(true);
    const res = await saveKundli(member.id, form);
    setLoading(false);
    if (res?.error) setMessage({ type: "err", text: res.error });
    else setMessage({ type: "ok", text: "Saved." });
  }

  async function handleDelete() {
    if (!confirm("Delete this Janam Kundli?")) return;
    setLoading(true);
    await deleteKundli(member.id);
    setLoading(false);
    setForm({ birthDate: "", birthTime: "", birthPlace: "", notes: "", visibility: "HIDDEN" });
    setOpen(false);
  }

  return (
    <div
      className="bg-white rounded-[20px] border border-[#ece5d5] overflow-hidden"
      style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-[14px] px-[24px] py-[18px] hover:bg-[#faf8f3] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-[14px] min-w-0">
          <div className="w-[44px] h-[44px] rounded-full bg-[var(--color-bg-secondary)] text-white flex items-center justify-center text-[16px] font-[family-name:var(--font-heading)] shrink-0">
            {member.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 text-left">
            <div className="text-[16px] font-medium text-[var(--color-bg-secondary)] truncate">
              {member.fullName}
            </div>
            <div className="text-[13px] text-[var(--color-text-secondary)]">
              {member.relation}
              {hasKundli ? " • Kundli added" : " • Not added"}
            </div>
          </div>
        </div>
        <span className="text-[var(--color-text-secondary)] text-[14px] shrink-0">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="px-[24px] pb-[24px] pt-[6px] border-t border-[#f0eadd]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mt-[16px]">
            <Input
              id={`bd-${member.id}`}
              label="Birth Date"
              type="date"
              value={form.birthDate}
              onChange={(e) => update("birthDate", e.target.value)}
            />
            <Input
              id={`bt-${member.id}`}
              label="Birth Time"
              type="time"
              value={form.birthTime}
              onChange={(e) => update("birthTime", e.target.value)}
            />
            <Input
              id={`bp-${member.id}`}
              label="Birth Place"
              value={form.birthPlace}
              onChange={(e) => update("birthPlace", e.target.value)}
              placeholder="City / Village"
            />
            <Select
              id={`vis-${member.id}`}
              label="Who can see this?"
              options={VISIBILITY_OPTIONS}
              placeholder="Hidden"
              value={form.visibility}
              onChange={(e) => update("visibility", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[8px] mt-[16px]">
            <label className="text-[15px] font-medium text-[var(--color-text)]">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="Rashi, Nakshatra, Gotra, or any details..."
              className="w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] resize-y"
            />
          </div>

          {message && (
            <p
              className={`text-[14px] rounded-[12px] px-[14px] py-[10px] mt-[14px] ${
                message.type === "ok"
                  ? "text-[#0e7a3d] bg-[#18b76015]"
                  : "text-[var(--color-secondary)] bg-[var(--color-secondary)]/8"
              }`}
            >
              {message.text}
            </p>
          )}

          <div className="flex items-center gap-[12px] mt-[18px]">
            <Button variant="primary" onClick={handleSave}>
              {loading ? "Saving..." : "Save Kundli"}
            </Button>
            {hasKundli && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-[15px] text-[var(--color-secondary)] font-medium hover:opacity-80 cursor-pointer disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KundliManager({ members }: { members: Member[] }) {
  return (
    <div className="flex flex-col gap-[14px]">
      {members.map((m) => (
        <MemberKundli key={m.id} member={m} />
      ))}
    </div>
  );
}
