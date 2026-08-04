"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseLinks = [
  { label: "Overview", href: "/dashboard", icon: "🏠" },
  { label: "My Family", href: "/dashboard/family", icon: "👨‍👩‍👧‍👦" },
  { label: "Janam Kundli", href: "/dashboard/family/kundli", icon: "📜" },
  { label: "Documents", href: "/dashboard/family/documents", icon: "🔒" },
  { label: "Marriage", href: "/dashboard/marriage", icon: "💍" },
  { label: "ID Card", href: "/dashboard/id-card", icon: "🪪" },
  { label: "Grievance", href: "/dashboard/grievance", icon: "📮" },
];

export default function DashboardSidebar({ isCommitteeMember = false }: { isCommitteeMember?: boolean }) {
  const pathname = usePathname();

  // Insert the Committee Tasks link (only for committee members) after Marriage
  const links = [...baseLinks];
  if (isCommitteeMember) {
    const idx = links.findIndex((l) => l.href === "/dashboard/marriage");
    links.splice(idx + 1, 0, { label: "Committee Tasks", href: "/dashboard/committee", icon: "🏛️" });
  }

  return (
    <aside className="w-full md:w-[240px] shrink-0">
      <nav className="flex md:flex-col gap-[6px] overflow-x-auto md:overflow-visible">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-[12px] px-[16px] py-[12px] rounded-[14px] text-[16px] whitespace-nowrap transition-colors ${
                active
                  ? "bg-[var(--color-primary)] text-white"
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
