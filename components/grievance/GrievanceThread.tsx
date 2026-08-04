"use client";

import { useState, useRef } from "react";
import { addGrievanceComment } from "@/app/actions/grievance";

type Comment = {
  id: string;
  authorRole: string;
  body: string;
  attachmentUrl: string | null;
  createdAt: string;
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GrievanceThread({
  grievanceId,
  comments,
  viewerRole,
  disabled = false,
}: {
  grievanceId: string;
  comments: Comment[];
  viewerRole: "MEMBER" | "ADMIN";
  disabled?: boolean;
}) {
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSend() {
    setError("");
    if (!body.trim() && !file) {
      setError("Write a message or attach an image.");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    const formData = new FormData();
    formData.append("body", body);
    if (file) formData.append("file", file);

    setLoading(true);
    const res = await addGrievanceComment(grievanceId, formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setBody("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mt-[16px] pt-[16px] border-t border-[#f0eadd]">
      <div className="text-[13px] tracking-[1px] uppercase text-[var(--color-text-secondary)] mb-[14px]">
        Conversation ({comments.length})
      </div>

      {comments.length > 0 && (
        <div className="flex flex-col gap-[12px] mb-[18px]">
          {comments.map((c) => {
            const isAdmin = c.authorRole === "ADMIN";
            return (
              <div
                key={c.id}
                className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-[16px] px-[16px] py-[12px] ${
                    isAdmin
                      ? "bg-[var(--color-bg-secondary)] text-white"
                      : "bg-[#faf8f3] border border-[#ece5d5] text-[var(--color-text)]"
                  }`}
                >
                  <div className="text-[12px] font-medium mb-[4px] text-[var(--color-primary)]">
                    {isAdmin ? "Admin" : "Member"} • {formatTime(c.createdAt)}
                  </div>
                  {c.body ? (
                    <p className={`text-[15px] ${isAdmin ? "text-white" : "text-[var(--color-text)]"}`}>
                      {c.body}
                    </p>
                  ) : null}
                  {c.attachmentUrl ? (
                    <img
                      src={c.attachmentUrl}
                      alt="Attachment"
                      onClick={() => window.open(c.attachmentUrl!, "_blank")}
                      className="max-w-[200px] max-h-[200px] rounded-[10px] border border-white/20 object-cover mt-[8px] cursor-pointer"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {disabled ? (
        <p className="text-[14px] text-[var(--color-text-secondary)] bg-[#faf8f3] rounded-[12px] px-[14px] py-[10px]">
          This grievance is closed. No further replies can be added.
        </p>
      ) : (
        <div className="bg-white rounded-[16px] border border-[#ece5d5] p-[14px]">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Write a reply..."
            className="w-full text-[15px] text-[var(--color-text)] outline-none resize-y bg-transparent"
          />
          <div className="flex items-center justify-between gap-[12px] mt-[10px] pt-[10px] border-t border-[#f0eadd]">
            <div className="flex items-center gap-[10px] min-w-0">
              <label className="text-[14px] text-[var(--color-primary)] cursor-pointer hover:opacity-80 shrink-0">
                📎 Attach image
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {file ? (
                <span className="text-[13px] text-[var(--color-text-secondary)] truncate">
                  {file.name}
                </span>
              ) : null}
            </div>
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-[var(--color-primary)] text-white rounded-[40px] px-[20px] py-[8px] text-[14px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
          {error ? (
            <p className="text-[13px] text-[var(--color-secondary)] mt-[8px]">{error}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
