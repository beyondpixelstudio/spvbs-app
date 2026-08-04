"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import Button from "./Button";
import { logout } from "@/app/actions/auth";

type NavChild = { label: string; href: string };
type NavItem = { label: string; href: string; children?: NavChild[] };
type NavUser = { name: string; role: string } | null;

export default function NavbarClient({ user }: { user: NavUser }) {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const nav = siteConfig.nav as NavItem[];

  const dashHref =
    user?.role === "SUPER_ADMIN" || user?.role === "TALUKA_ADMIN"
      ? "/admin"
      : "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
      <nav className="max-w-[1200px] mx-auto px-[20px] flex items-center justify-between h-[80px]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-[12px]">
          <div className="w-[52px] h-[52px] rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center p-[6px]">
            <Image src="/logo.png" alt={siteConfig.shortName + " logo"} width={40} height={40} className="object-contain" />
          </div>
          <span className="font-[family-name:var(--font-heading)] text-[20px] leading-tight text-[var(--color-bg-secondary)] hidden sm:block">
            {siteConfig.shortName}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-[26px]">
          {nav.map((item) => (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.children ? (
                <>
                  <button className="flex items-center gap-[4px] text-[16px] text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                    {item.label}
                    <span className="text-[10px]">▼</span>
                  </button>
                  {openDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 pt-[10px] min-w-[220px]"
                    >
                      <div
                        className="bg-[var(--color-bg-secondary)] rounded-[16px] py-[10px] overflow-hidden"
                        style={{ boxShadow: "rgba(40, 63, 116, 0.25) 0px 8px 30px 0px" }}
                      >
                        {item.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block px-[20px] py-[10px] text-[15px] text-[#cedbf5] hover:text-[var(--color-primary)] hover:bg-white/5 transition-colors"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} className="text-[16px] text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden lg:flex items-center gap-[16px]">
          {user ? (
            <>
              <Link href={dashHref} className="flex items-center gap-[8px] text-[16px] text-[var(--color-text)] hover:text-[var(--color-primary)]">
                <span className="w-[34px] h-[34px] rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-[15px] font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                {user.name.split(" ")[0]}
              </Link>
              <form action={logout}>
                <button type="submit" className="text-[16px] text-[var(--color-secondary)] hover:opacity-80 cursor-pointer">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-[16px] text-[var(--color-text)] hover:text-[var(--color-primary)]">
                Login
              </Link>
              <Button href="/register" variant="primary" className="!py-[10px] !px-[24px] !text-[16px]">
                Membership
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden flex flex-col gap-[5px] p-[8px]" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span className="w-[24px] h-[2px] bg-[var(--color-text)]" />
          <span className="w-[24px] h-[2px] bg-[var(--color-text)]" />
          <span className="w-[24px] h-[2px] bg-[var(--color-text)]" />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[var(--color-border)] px-[20px] py-[20px] flex flex-col gap-[14px]">
          {nav.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setMobileDropdown(mobileDropdown === item.label ? null : item.label)}
                    className="flex items-center gap-[6px] text-[18px] text-[var(--color-text)] cursor-pointer"
                  >
                    {item.label}
                    <span className="text-[11px]">{mobileDropdown === item.label ? "▲" : "▼"}</span>
                  </button>
                  {mobileDropdown === item.label && (
                    <div className="flex flex-col gap-[10px] mt-[10px] pl-[16px] border-l-2 border-[var(--color-border)]">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="text-[16px] text-[var(--color-text-secondary)]">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} onClick={() => setOpen(false)} className="text-[18px] text-[var(--color-text)]">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <hr className="border-[var(--color-border)]" />
          {user ? (
            <>
              <Link href={dashHref} onClick={() => setOpen(false)} className="text-[18px] text-[var(--color-text)]">
                {user.name.split(" ")[0]}&apos;s Dashboard
              </Link>
              <form action={logout}>
                <button type="submit" className="text-[18px] text-[var(--color-secondary)] text-left cursor-pointer">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-[18px] text-[var(--color-text)]">
                Login
              </Link>
              <Button href="/register" variant="primary">Membership</Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
