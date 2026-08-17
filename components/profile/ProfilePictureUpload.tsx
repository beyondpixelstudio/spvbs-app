"use client";

import { useState, useRef } from "react";
import { uploadProfilePicture, removeProfilePicture } from "@/app/actions/profile-picture";

export default function ProfilePictureUpload({ currentUrl }: { currentUrl: string | null }) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setSuccess(false);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024) {
      setError("Image must be under 200KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    setError("");
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const file = formData.get("photo") as File;
    if (!file || file.size === 0) {
      setError("Please choose an image first.");
      return;
    }
    setLoading(true);
    const res = await uploadProfilePicture(formData);
    setLoading(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setSuccess(true);
    if (res.url) setPreview(res.url);
  }

  async function handleRemove() {
    if (!confirm("Remove your profile picture?")) return;
    setLoading(true);
    await removeProfilePicture();
    setLoading(false);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[24px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
      <h4 className="!text-[17px] text-[var(--color-bg-secondary)] mb-[16px]">Profile Picture</h4>

      <div className="flex items-center gap-[20px] flex-wrap">
        <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-[#faf8f3] border border-[#ece5d5] flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[32px] text-[var(--color-text-secondary)]">👤</span>
          )}
        </div>

        <form ref={formRef} className="flex flex-col gap-[10px]">
          <label className="flex items-center gap-[10px] rounded-[12px] border border-[#ece5d5] bg-[#faf8f3] px-[14px] py-[10px] text-[14px] text-[var(--color-primary)] cursor-pointer hover:opacity-80 w-fit">
            📎 Choose photo
            <input
              ref={fileRef}
              type="file"
              name="photo"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
          <p className="text-[12px] text-[var(--color-text-secondary)]">JPG, PNG, or WebP. Max 200KB.</p>

          <div className="flex items-center gap-[12px] mt-[4px]">
            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="bg-[var(--color-primary)] text-white rounded-[40px] px-[20px] py-[8px] text-[14px] font-medium hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "Save Photo"}
            </button>
            {currentUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={loading}
                className="text-[13px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <p className="text-[13px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[10px] px-[12px] py-[8px] mt-[14px]">
          {error}
        </p>
      )}
      {success && (
        <p className="text-[13px] text-[#0e7a3d] bg-[#18b76015] rounded-[10px] px-[12px] py-[8px] mt-[14px]">
          ✓ Profile picture updated.
        </p>
      )}
    </div>
  );
}
