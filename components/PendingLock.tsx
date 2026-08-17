export default function PendingLock({ feature }: { feature: string }) {
  return (
    <div className="bg-white rounded-[31px] border border-[var(--color-border)] p-[40px] text-center" style={{ boxShadow: "var(--shadow-elevated)" }}>
      <div className="text-[44px] mb-[16px]">⏳</div>
      <h4 className="!text-[24px] text-[var(--color-bg-secondary)] mb-[10px]">
        Approval Pending
      </h4>
      <p className="text-[16px] text-[var(--color-text)] max-w-[440px] mx-auto">
        Your membership request is under review by our committee. You&apos;ll be able to
        use {feature} once your account is approved.
      </p>
    </div>
  );
}
