"use client";

import { useState } from "react";
import { markMessageRead, deleteMessage } from "@/app/actions/messages";

export default function MessageCard({
  id, name, taluka, village, phone, email, subject, message, isRead, createdAt,
}: {
  id: string; name: string; taluka: string | null; village: string | null;
  phone: string | null; email: string | null; subject: string | null;
  message: string; isRead: boolean; createdAt: string;
}) {
  const [loading, setLoading] = useState(false);
  const date = new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  async function toggleRead() {
    setLoading(true);
    await markMessageRead(id, !isRead);
    setLoading(false);
  }
  async function handleDelete() {
    if (!confirm(`Delete message from ${name}?`)) return;
    setLoading(true);
    await deleteMessage(id);
    setLoading(false);
  }

  return (
    <div className={`bg-white rounded-[20px] border p-[24px] ${isRead ? "border-[#ece5d5]" : "border-[var(--color-primary)]"}`} style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
      <div className="flex items-start justify-between gap-[14px] flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-[10px] flex-wrap">
            <h4 className="!text-[18px] text-[var(--color-bg-secondary)]">{name}</h4>
            {!isRead && <span className="text-[11px] font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-[10px] py-[3px] rounded-[40px]">New</span>}
          </div>
          <p className="text-[13px] text-[var(--color-text-secondary)] mt-[2px]">
            {[taluka, village].filter(Boolean).join(" • ") || "—"}
          </p>
        </div>
        <span className="text-[12px] text-[var(--color-text-secondary)]">{date}</span>
      </div>

      {subject && (
        <p className="text-[15px] text-[var(--color-bg-secondary)] font-medium mt-[14px]">{subject}</p>
      )}
      {message && message !== subject && (
        <p className="text-[15px] text-[var(--color-text)] mt-[6px] leading-relaxed whitespace-pre-wrap">{message}</p>
      )}

      <div className="flex flex-wrap items-center gap-[16px] mt-[16px] pt-[16px] border-t border-[#f0eadd]">
        {phone && <a href={`tel:${phone}`} className="text-[14px] text-[var(--color-primary)] hover:opacity-80">📞 {phone}</a>}
        {email && <a href={`mailto:${email}`} className="text-[14px] text-[var(--color-primary)] hover:opacity-80 break-all">📧 {email}</a>}
        <div className="flex-1" />
        <button onClick={toggleRead} disabled={loading} className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-bg-secondary)] cursor-pointer disabled:opacity-50">
          {isRead ? "Mark unread" : "Mark read"}
        </button>
        <button onClick={handleDelete} disabled={loading} className="text-[13px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer disabled:opacity-50">
          Delete
        </button>
      </div>
    </div>
  );
}
