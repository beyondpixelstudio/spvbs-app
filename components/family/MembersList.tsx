"use client";

import { useState } from "react";
import Button from "@/components/Button";
import MemberFormModal, { MemberData } from "./MemberFormModal";
import { deleteFamilyMember } from "@/app/actions/family";

const visibilityBadge: Record<string, { label: string; color: string; bg: string }> = {
  PUBLIC: { label: "Public", color: "#0e7a3d", bg: "#18b76015" },
  MEMBERS_ONLY: { label: "Members only", color: "#8a6d1a", bg: "#ffc03920" },
  HIDDEN: { label: "Hidden", color: "#666666", bg: "#66666615" },
};

export default function MembersList({ members }: { members: MemberData[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MemberData | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function openAdd() {
    setEditing(undefined);
    setModalOpen(true);
  }
  function openEdit(m: MemberData) {
    setEditing(m);
    setModalOpen(true);
  }
  async function handleDelete(id: string) {
    if (!confirm("Remove this family member?")) return;
    setDeletingId(id);
    await deleteFamilyMember(id);
    setDeletingId(null);
  }

  const sorted = [...members].sort((a, b) =>
    a.relation === "Head" ? -1 : b.relation === "Head" ? 1 : 0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-[20px]">
        <h4 className="!text-[22px] text-[var(--color-bg-secondary)]">
          Family Members ({members.length})
        </h4>
        <Button variant="secondary" onClick={openAdd} className="!py-[10px] !px-[22px] !text-[16px]">
          + Add member
        </Button>
      </div>

      {members.length === 0 ? (
        <p className="text-[16px] text-[var(--color-text-secondary)]">
          No members added yet. Click &quot;Add member&quot; to begin.
        </p>
      ) : (
        <div className="flex flex-col gap-[14px]">
          {sorted.map((m) => {
            const vb = visibilityBadge[m.visibility || "MEMBERS_ONLY"];
            const isHead = m.relation === "Head";
            return (
              <div
                key={m.id}
                className="bg-white rounded-[20px] border border-[var(--color-border)] p-[20px] flex flex-wrap items-center justify-between gap-[14px]"
                style={{ boxShadow: "var(--shadow-elevated)" }}
              >
                <div className="flex items-center gap-[14px] min-w-0">
                  <div className="w-[46px] h-[46px] rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[18px] font-medium shrink-0">
                    {m.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[17px] font-medium text-[var(--color-text)] truncate">
                        {m.fullName}
                      </span>
                      {isHead && (
                        <span className="text-[12px] px-[8px] py-[2px] rounded-full bg-[var(--color-bg-secondary)] text-white">
                          Head
                        </span>
                      )}
                    </div>
                    <div className="text-[14px] text-[var(--color-text-secondary)]">
                      {m.relation}
                      {m.occupation ? ` • ${m.occupation}` : ""}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[10px]">
                  <span
                    className="text-[12px] px-[10px] py-[4px] rounded-full"
                    style={{ color: vb.color, background: vb.bg }}
                  >
                    {vb.label}
                  </span>
                  <button
                    onClick={() => openEdit(m)}
                    className="text-[15px] text-[var(--color-primary)] hover:opacity-80 cursor-pointer"
                  >
                    Edit
                  </button>
                  {!isHead && (
                    <button
                      onClick={() => handleDelete(m.id!)}
                      disabled={deletingId === m.id}
                      className="text-[15px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer disabled:opacity-50"
                    >
                      {deletingId === m.id ? "..." : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <MemberFormModal member={editing} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
