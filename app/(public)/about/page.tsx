import Image from "next/image";
export default function AboutPage() {
  const activities = [
    { icon: "🌱", title: "Plantation & Environment", desc: "Environmental awareness drives to support nature and ecological balance." },
    { icon: "🙏", title: "Women Empowerment", desc: "Encouragement, participation, and social upliftment of women in our community." },
    { icon: "📿", title: "Shodasha Sanskara", desc: "Promotion and preservation of the sixteen sacred rites that guide human life." },
    { icon: "📚", title: "Children's Education", desc: "Supporting education to build a knowledgeable and responsible future generation." },
    { icon: "🕉️", title: "Jangyapabita Sanskar", desc: "Upholding the Yajnopavita / Upanayana Sanskar as an inseparable part of our heritage." },
    { icon: "💧", title: "Social Welfare", desc: "Clean water, child welfare, and initiatives for the betterment of society." },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {/* Hero */}
      <div className="bg-[var(--color-bg-secondary)] py-[60px] px-[20px]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[16px]">About Us</div>
          <h1 className="!text-[38px] !text-white font-[family-name:var(--font-heading)] leading-tight">
            Sri Sri Nikhil Utkal Saiba Panchal Viswa Brahmin Samaj
          </h1>
          <p className="text-[17px] text-[#cedbf5] mt-[18px] leading-relaxed">
            A culturally rooted community guided by the sacred values and teachings of Rishi Parampara — preserving traditions,
            promoting social responsibility, and strengthening the spiritual and cultural identity of our families and future generations.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-[20px] py-[50px]">
        {/* Intro */}
        <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[32px] mb-[40px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
          <p className="text-[16px] text-[var(--color-text)] leading-[1.8]">
            The Saiba Panchal Viswa Brahman community actively engages in various social welfare initiatives that contribute to the
            betterment of society and community life. We believe in harmonizing tradition with social progress, ensuring that our
            customs, values, and responsibilities continue to inspire and guide present and future generations. Our community stands
            united in service, culture, and spiritual heritage, working together for the welfare and development of society.
          </p>
        </div>

        {/* Activities */}
        <div className="text-center mb-[30px]">
          <h2 className="!text-[30px] text-[var(--color-bg-secondary)] font-[family-name:var(--font-heading)]">Our Key Activities</h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-[6px]">Contributing to society through service and tradition</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] mb-[50px]">
          {activities.map((a) => (
            <div key={a.title} className="bg-white rounded-[20px] border border-[#ece5d5] p-[24px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
              <div className="text-[36px] mb-[12px]">{a.icon}</div>
              <h4 className="!text-[18px] text-[var(--color-bg-secondary)] mb-[8px]">{a.title}</h4>
              <p className="text-[14px] text-[var(--color-text)] leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Sacred Heritage */}
        <div className="bg-[var(--color-bg-secondary)] rounded-[28px] p-[40px] text-center">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[16px]">Our Sacred Heritage</div>
          <p className="text-[16px] text-[#e8eefb] leading-[1.9] max-w-[760px] mx-auto">
            The roots of Saiba Panchal Viswa Brahman trace back to the divine tradition of <strong className="text-white">Panchu Brahma (Pancha Brahma)</strong>,
            the eternal source of sacred wisdom, craftsmanship, and spiritual knowledge. Guided by this revered lineage, our community
            carries forward the values of dharma, devotion, and righteous living preserved through generations.
          </p>
          <p className="text-[16px] text-[#e8eefb] leading-[1.9] max-w-[760px] mx-auto mt-[20px]">
            We hold deep reverence for our core ancestor, <strong className="text-white">Veer Brahmendra Swami</strong>, whose spiritual teachings,
            foresight, and divine wisdom continue to illuminate our path — inspiring us to remain steadfast in truth, humility, service, and spiritual discipline.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] max-w-[680px] mx-auto mt-[36px]">
            <div className="rounded-[20px] overflow-hidden border border-white/15">
              <img src="/about-shiva.png" alt="Lord Shiva" className="w-full h-auto block" />
            </div>
            <div className="rounded-[20px] overflow-hidden border border-white/15">
              <img src="/about-gayatri.png" alt="Gayatri Mantra" className="w-full h-auto block" />
            </div>
          </div>

          <div className="mt-[30px] pt-[24px] border-t border-white/15">
            <p className="text-[20px] text-[var(--color-primary)] font-[family-name:var(--font-heading)] leading-relaxed">
              ଆମର ପରମ୍ପରା ଆମର ଶକ୍ତି, ଆମର ଋଷି ଐତିହ୍ୟ ଆମର ଗୌରବ।
            </p>
            <p className="text-[14px] text-[#cedbf5] mt-[8px] italic">
              Our tradition is our strength, and our Rishi heritage is our pride.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
