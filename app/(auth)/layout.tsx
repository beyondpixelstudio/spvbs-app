export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-[20px] py-[60px] bg-[var(--color-bg)]">
      {/* Card */}
      <div
        className="w-full max-w-[440px] bg-white rounded-[31px] border border-[var(--color-border)] p-[40px]"
        style={{ boxShadow: "var(--shadow-elevated)" }}
      >
        {children}
      </div>
    </div>
  );
}
