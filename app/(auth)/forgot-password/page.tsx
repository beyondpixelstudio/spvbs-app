"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleReset() {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      }
    );
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-extra-green)]/15 flex items-center justify-center mx-auto mb-[20px] text-[30px]">
          ✉️
        </div>
        <h4 className="!text-[24px] text-[var(--color-bg-secondary)] mb-[12px]">
          Check your email
        </h4>
        <p className="text-[16px] text-[var(--color-text)] mb-[24px]">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a
          password reset link. Open it to set a new password.
        </p>
        <Button href="/login" variant="primary" className="w-full">
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h4 className="!text-[26px] text-[var(--color-bg-secondary)] mb-[6px]">
        Forgot password?
      </h4>
      <p className="text-[15px] text-[var(--color-text-secondary)] mb-[26px]">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <div className="flex flex-col gap-[18px]">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px]">
            {error}
          </p>
        )}

        <Button variant="primary" onClick={handleReset} className="w-full">
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </div>

      <p className="text-[15px] text-[var(--color-text-secondary)] text-center mt-[24px]">
        Remembered it?{" "}
        <Link href="/login" className="text-[var(--color-primary)] font-medium">
          Back to login
        </Link>
      </p>
    </div>
  );
}
