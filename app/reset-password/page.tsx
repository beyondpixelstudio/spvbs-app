"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  // When the user lands from the email link, Supabase creates a temporary session
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Also check if a session already exists (link already processed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleUpdate() {
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2500);
  }

  return (
    <div className="flex flex-col items-center justify-center px-[20px] py-[60px] bg-[var(--color-bg)]">
      <div
        className="w-full max-w-[440px] bg-white rounded-[31px] border border-[var(--color-border)] p-[40px]"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {success ? (
          <div className="text-center">
            <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-extra-green)]/15 flex items-center justify-center mx-auto mb-[20px] text-[30px]">
              ✓
            </div>
            <h4 className="!text-[24px] text-[var(--color-bg-secondary)] mb-[12px]">
              Password updated
            </h4>
            <p className="text-[16px] text-[var(--color-text)]">
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
            <h4 className="!text-[26px] text-[var(--color-bg-secondary)] mb-[6px]">
              Set a new password
            </h4>
            <p className="text-[15px] text-[var(--color-text-secondary)] mb-[26px]">
              Choose a strong password for your account.
            </p>

            {!ready && (
              <p className="text-[14px] text-[#8a6d1a] bg-[#ffc03915] rounded-[12px] px-[14px] py-[10px] mb-[18px]">
                Verifying your reset link... If this stays, please open the link
                from your email again.
              </p>
            )}

            <div className="flex flex-col gap-[18px]">
              <Input
                id="password"
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error && (
                <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px]">
                  {error}
                </p>
              )}

              <Button
                variant="primary"
                onClick={handleUpdate}
                className="w-full"
              >
                {loading ? "Updating..." : "Update password"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
