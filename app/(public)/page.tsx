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
      {/* ===== HERO (Vishwakarma) ===== */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center">
        <img
          src="/ChatGPT-Image-Jun-3-2026-11_14_49-PM.png"
          alt="Lord Vishwakarma"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-secondary)] via-[var(--color-bg-secondary)]/80 to-transparent" />
        <div className="relative max-w-[1200px] mx-auto px-[20px] py-[100px] w-full">
          <div className="max-w-[480px]">
            <h1 className="!text-[34px] sm:!text-[48px] !leading-[1.2] !text-white">
              {siteConfig.name}
            </h1>
            <p className="text-[18px] text-[#e8eefb] mt-[24px] leading-relaxed">
              Carrying forward the divine legacy of Lord Vishwakarma&apos;s five sons, we embody a rich
              heritage of creation rooted in the Vedas. United under the philosophy of &quot;Vasudhaiva Kutumbakam.&quot;
            </p>
            <div className="flex flex-wrap items-center gap-[16px] mt-[36px]">
              <Button href="/about" variant="primary">Know More</Button>
              <Button href="/members" variant="outline">Explore Members</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="max-w-[1200px] mx-auto px-[20px] py-[90px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          <div className="order-1 lg:order-1">
            <h2 className="!text-[26px] sm:!text-[30px] text-[var(--color-bg-secondary)] uppercase !leading-[1.3]">
              {siteConfig.name}
            </h2>
            <p className="text-[16px] text-[var(--color-text)] mt-[24px] leading-[1.8] text-justify">
              Saiba Panchal Viswa Brahman Community is a culturally rooted community guided by the sacred values and teachings of Rishi Parampara. Our foundation is built on preserving traditions, promoting social responsibility, and strengthening the spiritual and cultural identity of our families and future generations.
            </p>
            <p className="text-[16px] text-[var(--color-text)] mt-[16px] leading-[1.8] text-justify">
              We actively engage in various social welfare initiatives that contribute to the betterment of society and community life. Our key activities includes:
            </p>
            <div className="flex flex-col gap-[12px] mt-[24px]">
              {[
                "Plantation and environmental awareness to support nature and ecological balance",
                "Women empowerment through encouragement, participation, and social upliftment",
                "Promotion and preservation of Shodasha Sanskara, the sixteen sacred rites that guide human life according to our traditions",
                "Encouraging and supporting children's education to build a knowledgeable and responsible future generation",
                "Upholding Jangyapabita Sanskar (Yajnopavita/Upanayana Sanskar) as an essential and inseparable part of our cultural and spiritual heritage",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-[12px]">
                  <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-primary)] shrink-0 mt-[9px]" />
                  <p className="text-[15px] text-[var(--color-text)] leading-[1.5] text-justify">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-2 lg:order-2 flex justify-center">
            <div className="w-full max-w-[420px] aspect-square rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center p-[50px]" style={{ boxShadow: "rgba(40, 63, 116, 0.15) 0px 10px 40px 0px" }}>
              <img src="/logo.png" alt={siteConfig.shortName + " logo"} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SAMAJ KALYAN ===== */}
      <section className="max-w-[1200px] mx-auto px-[20px] py-[90px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
          <div className="flex justify-center">
            <div className="w-full max-w-[420px] aspect-square rounded-full overflow-hidden border-[6px] border-white" style={{ boxShadow: "rgba(40, 63, 116, 0.15) 0px 10px 40px 0px" }}>
              <img
                src="/ChatGPT-Image-Jun-3-2026-11_46_53-PM-1024x1024.png"
                alt="Veer Brahmendra Swami"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="!text-[30px] sm:!text-[36px] text-[var(--color-bg-secondary)] !leading-[1.2]">
              SAMAJ<br />KALYAN
            </h2>
            <p className="text-[16px] text-[var(--color-text)] mt-[24px] leading-[1.8] max-w-[520px]">
              Dedicated to the upliftment and well-being of our community, the Viswa Brahmin Samaj actively
              drives essential welfare initiatives. Through collective support, we aim to empower families,
              assist those in need, and foster a stronger, more resilient society. We invite our members to
              collaborate with local committees to create lasting social impact.
            </p>
            <div className="flex flex-wrap gap-[30px] mt-[36px]">
              <div className="flex items-center gap-[14px]">
                <div className="w-[56px] h-[56px] rounded-full bg-[#cedbf5] flex items-center justify-center text-[24px] shrink-0">👨‍👩‍👧</div>
                <span className="text-[17px] font-medium text-[var(--color-bg-secondary)]">Family<br />Support</span>
              </div>
              <div className="flex items-center gap-[14px]">
                <div className="w-[56px] h-[56px] rounded-full bg-[#fdf1e0] flex items-center justify-center text-[24px] shrink-0">💧</div>
                <span className="text-[17px] font-medium text-[var(--color-bg-secondary)]">Community<br />Welfare</span>
              </div>
            </div>
          </div>
        </div>
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
