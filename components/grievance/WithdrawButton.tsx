"use client";

import { useState } from "react";
import { withdrawGrievance, appealGrievance } from "@/app/actions/grievance";

export default function WithdrawButton({
  grievanceId,
  mode = "withdraw",
}: {
  grievanceId: string;
  mode?: "withdraw" | "appeal";
}) {
  const [loading, setLoading] = useState(false);

  async function handle() {
    if (mode === "appeal") {
      if (!confirm("Appeal this grievance? It will be reopened for the admin to review again.")) return;
      setLoading(true);
      await appealGrievance(grievanceId);
      setLoading(false);
    } else {
      if (!confirm("Withdraw this grievance? You won't be able to reopen it.")) return;
      setLoading(true);
      await withdrawGrievance(grievanceId);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className={`text-[14px] font-medium hover:opacity-80 cursor-pointer disabled:opacity-50 shrink-0 ${
        mode === "appeal" ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)]"
      }`}
    >
      {loading ? "..." : mode === "appeal" ? "Appeal" : "Withdraw"}
    </button>
  );
}
