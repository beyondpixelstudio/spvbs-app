import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
};

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-[40px] px-[30px] py-[14px] text-[18px] cursor-pointer";

const variants: Record<string, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:opacity-90 hover:-translate-y-[1px]",
  secondary:
    "bg-[var(--color-secondary)] text-white hover:opacity-90 hover:-translate-y-[1px]",
  outline:
    "border border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-white",
};

export default function Button({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
