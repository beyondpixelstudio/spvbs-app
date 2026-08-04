"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // On success, send them to their dashboard
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <h4 className="!text-[26px] text-[var(--color-bg-secondary)] mb-[6px]">
        Welcome back
      </h4>
      <p className="text-[15px] text-[var(--color-text-secondary)] mb-[26px]">
        Login to access your family dashboard.
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
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right -mt-[6px]">
          <Link
            href="/forgot-password"
            className="text-[14px] text-[var(--color-primary)] hover:opacity-80"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px]">
            {error}
          </p>
        )}

        <Button variant="primary" onClick={handleLogin} className="w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>

      <p className="text-[15px] text-[var(--color-text-secondary)] text-center mt-[24px]">
        New to the samaj?{" "}
        <Link href="/register" className="text-[var(--color-primary)] font-medium">
          Register your family
        </Link>
      </p>
    </div>
  );
}
