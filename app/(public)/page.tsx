import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Button from "@/components/Button";

const features = [
  {
    title: "Members",
    desc: "Browse and connect with family heads across the samaj. Search by name, village, or profession.",
    href: "/members",
    color: "var(--color-primary)",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "Committee",
    desc: "Meet the taluka and central committee members serving our community.",
    href: "/committee",
    color: "var(--color-secondary)",
    icon: "🏛️",
  },
  {
    title: "Events & Sammelan",
    desc: "Stay updated on gatherings, festivals, and functions. RSVP and never miss a moment.",
    href: "/events",
    color: "var(--color-extra-green)",
    icon: "📅",
  },
  {
    title: "Marriage Permission",
    desc: "Apply for and manage marriage & negotiation approvals from the committee.",
    href: "/permission/marriage",
    color: "var(--color-extra-yellow)",
    icon: "💌",
  },
  {
    title: "Membership",
    desc: "Register your family and become a recognised member of the samaj.",
    href: "/register",
    color: "var(--color-bg-secondary)",
    icon: "🪪",
  },
  {
    title: "Grievance Box",
    desc: "Raise concerns or suggestions and track them until they are resolved.",
    href: "/dashboard/grievance",
    color: "var(--color-primary)",
    icon: "📮",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-[20px] pt-[90px] pb-[120px] text-center">
          <div className="flex justify-center mb-[24px]">
            <div className="w-[110px] h-[110px] rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center p-[14px]">
              <img src="/logo.png" alt={siteConfig.shortName + " logo"} className="w-full h-full object-contain" />
            </div>
          </div>
          <span className="inline-block text-[14px] tracking-[2px] uppercase text-[var(--color-primary)] mb-[20px]">
            {siteConfig.contact.address} • Est. Community
          </span>
          <h1 className="!text-[40px] sm:!text-[56px] !leading-[1.15] max-w-[900px] mx-auto text-[var(--color-bg-secondary)]">
            {siteConfig.name}
          </h1>
          <p className="text-[20px] text-[var(--color-text)] mt-[24px] max-w-[600px] mx-auto">
            {siteConfig.tagline} — {siteConfig.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-[16px] mt-[40px]">
            <Button href="/register" variant="primary">Register Your Family</Button>
            <Button href="/members" variant="outline">Explore Members</Button>
          </div>
        </div>

        {/* Decorative rounded shape */}
        <div
          className="absolute -top-[120px] -right-[120px] w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: "var(--color-primary)" }}
        />
        <div
          className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] rounded-full opacity-[0.05]"
          style={{ background: "var(--color-secondary)" }}
        />
      </section>

      {/* ===== STATS ===== */}
      <section className="bg-[var(--color-bg-secondary)] py-[60px]">
        <div className="max-w-[1000px] mx-auto px-[20px] grid grid-cols-1 sm:grid-cols-3 gap-[40px] text-center">
          {siteConfig.stats.map((s) => (
            <div key={s.label}>
              <div className="font-[family-name:var(--font-heading)] text-[48px] text-[var(--color-primary)]">
                {s.value}
              </div>
              <div className="text-[16px] text-[#cedbf5] mt-[6px]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-[1200px] mx-auto px-[20px] py-[90px]">
        <div className="text-center mb-[50px]">
          <h2 className="text-[var(--color-bg-secondary)]">Everything in one place</h2>
          <p className="text-[18px] text-[var(--color-text)] mt-[12px] max-w-[560px] mx-auto">
            A single platform to keep our community connected, informed, and united.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group block bg-white rounded-[31px] p-[34px] border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-[4px]"
              style={{ boxShadow: "var(--shadow-elevated)" }}
            >
              <div
                className="w-[60px] h-[60px] rounded-[20px] flex items-center justify-center text-[28px] mb-[20px]"
                style={{ background: `${f.color}1a` }}
              >
                {f.icon}
              </div>
              <h4 className="!text-[22px] text-[var(--color-bg-secondary)] mb-[10px]">
                {f.title}
              </h4>
              <p className="text-[16px] text-[var(--color-text)] leading-relaxed">
                {f.desc}
              </p>
              <span
                className="inline-block mt-[18px] text-[15px] font-medium"
                style={{ color: f.color }}
              >
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== JOIN CTA ===== */}
      <section className="max-w-[1200px] mx-auto px-[20px] pb-[120px]">
        <div
          className="rounded-[40px] px-[40px] py-[70px] text-center"
          style={{ background: "var(--color-primary)" }}
        >
          <h2 className="!text-white">Become part of the parivaar</h2>
          <p className="text-[18px] text-white/90 mt-[14px] max-w-[520px] mx-auto">
            Register your family today and get your digital membership card, directory
            listing, and access to community events.
          </p>
          <div className="mt-[34px] flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center bg-white text-[var(--color-primary)] font-medium rounded-[40px] px-[36px] py-[16px] text-[18px] hover:bg-[var(--color-bg-secondary)] hover:text-white transition-all"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
