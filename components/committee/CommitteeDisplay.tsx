"use client";

import { useState } from "react";
import { TALUKAS } from "@/lib/site-config";

type Member = {
  id: string;
  name: string;
  level: string;
  levelText: string;
  type: string;
  typeText: string;
  designation: string;
  designationText: string;
  taluka: string;
  village: string;
  order: number;
};

type TypeOption = { value: string; label: string };

const designationColor: Record<string, string> = {
  PRESIDENT: "var(--color-secondary)",
  SECRETARY: "var(--color-primary)",
  JOINT_SECRETARY: "var(--color-primary)",
  CASHIER: "var(--color-extra-green)",
  MEMBER: "var(--color-text-secondary)",
};

const DESIGNATIONS = [
  { value: "PRESIDENT", label: "President" },
  { value: "SECRETARY", label: "Secretary" },
  { value: "JOINT_SECRETARY", label: "Joint Secretary" },
  { value: "CASHIER", label: "Cashier" },
  { value: "MEMBER", label: "Member" },
];

function MemberCard({ m }: { m: Member }) {
  const color = designationColor[m.designation] || "var(--color-primary)";
  return (
    <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[22px] flex items-center gap-[16px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
      <div className="w-[56px] h-[56px] rounded-[18px] text-white flex items-center justify-center text-[22px] font-[family-name:var(--font-heading)] shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}>
        {m.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="text-[17px] font-medium text-[var(--color-bg-secondary)] truncate">{m.name}</div>
        <div className="text-[13px] font-medium mt-[2px]" style={{ color }}>{m.designationText}</div>
        <div className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
          {m.typeText}{m.taluka ? ` • ${m.taluka}` : ""}
        </div>
      </div>
    </div>
  );
}

export default function CommitteeDisplay({
  members,
  typeOptions,
}: {
  members: Member[];
  typeOptions: TypeOption[];
}) {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [talukaFilter, setTalukaFilter] = useState("ALL");
  const [designationFilter, setDesignationFilter] = useState("ALL");

  const filtered = members.filter((m) => {
    if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
    if (talukaFilter !== "ALL" && m.taluka !== talukaFilter) return false;
    if (designationFilter !== "ALL" && m.designation !== designationFilter) return false;
    return true;
  });

  const central = filtered.filter((m) => m.level === "CENTRAL");
  const taluka = filtered.filter((m) => m.level === "TALUKA");

  const selectClass = "w-full rounded-[14px] border border-[#ece5d5] bg-white px-[16px] py-[12px] text-[16px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] cursor-pointer";
  const labelClass = "text-[13px] tracking-[1px] uppercase text-[var(--color-text-secondary)] block mb-[8px]";

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-[30px]">
        <div>
          <label className={labelClass}>Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}>
            <option value="ALL">All Types</option>
            {typeOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Designation</label>
          <select value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)} className={selectClass}>
            <option value="ALL">All Designations</option>
            {DESIGNATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Taluka</label>
          <select value={talukaFilter} onChange={(e) => setTalukaFilter(e.target.value)} className={selectClass}>
            <option value="ALL">All Talukas</option>
            {TALUKAS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[40px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)]">Committee members will be listed here soon.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-[#ece5d5] px-[24px] py-[40px] text-center" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)]">No committee members match these filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[40px]">
          {central.length > 0 && (
            <div>
              <div className="flex items-center gap-[12px] mb-[18px]">
                <span className="text-[14px] tracking-[2px] uppercase text-[var(--color-secondary)] font-medium">
                  Central Committee ({central.length})
                </span>
                <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {central.map((m) => <MemberCard key={m.id} m={m} />)}
              </div>
            </div>
          )}

          {taluka.length > 0 && (
            <div>
              <div className="flex items-center gap-[12px] mb-[18px]">
                <span className="text-[14px] tracking-[2px] uppercase text-[var(--color-primary)] font-medium">
                  Taluka Committee ({taluka.length})
                </span>
                <span className="flex-1 h-[1px] bg-[var(--color-border)]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {taluka.map((m) => <MemberCard key={m.id} m={m} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
