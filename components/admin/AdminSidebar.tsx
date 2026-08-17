"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Overview", href: "/admin", icon: "📊" },
  { label: "Approvals", href: "/admin/approvals", icon: "✅" },
  { label: "Members", href: "/admin/members", icon: "👥" },
  { label: "Delete/Edit Requests", href: "/admin/deletion-requests", icon: "🗑️" },
  { label: "Committee", href: "/admin/committee", icon: "🏛️" },
  { label: "Marriage Permissions", href: "/admin/marriage", icon: "💍" },
  { label: "Messages", href: "/admin/messages", icon: "✉️" },
  { label: "Events", href: "/admin/events", icon: "📅" },
  { label: "Donations", href: "/admin/donations", icon: "🤝" },
  { label: "Gallery", href: "/admin/gallery", icon: "🖼️" },
  { label: "Grievances", href: "/admin/grievances", icon: "📮" },
  { label: "Broadcasts", href: "/admin/broadcasts", icon: "📢" },
];

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-[240px] shrink-0">
      <div className="mb-[16px] px-[16px]">
        <span className="text-[12px] tracking-[2px] uppercase text-[var(--color-text-secondary)]">
          {role === "SUPER_ADMIN" ? "Super Admin" : "Taluka Admin"}
        </span>
      </div>
      <nav className="flex md:flex-col gap-[6px] overflow-x-auto md:overflow-visible">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[14px] text-[16px] whitespace-nowrap transition-colors ${
                active
                  ? "bg-[var(--color-bg-secondary)] text-white"
                  : "text-[var(--color-text)] hover:bg-[var(--color-border)]"
              }`}
            >
              <span className="text-[18px]">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
