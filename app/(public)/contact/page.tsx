import { siteConfig } from "@/lib/site-config";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  const { email, phones, address, tagline, socials } = siteConfig.contact as any;

  const iconClass = "w-[20px] h-[20px]";
  const socialList = [
    {
      key: "facebook", label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
      ),
    },
    {
      key: "twitter", label: "X (Twitter)",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3L17.61 20.65z"/></svg>
      ),
    },
    {
      key: "youtube", label: "YouTube",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>
      ),
    },
    {
      key: "instagram", label: "Instagram",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.36 2.67.94 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.12-1.38c.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.12A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.41a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {/* Hero */}
      <div className="bg-[var(--color-bg-secondary)] py-[54px] px-[20px]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[14px]">Contact Us</div>
          <h1 className="!text-[38px] !text-white font-[family-name:var(--font-heading)]">Connect with the Community</h1>
          {tagline && (
            <p className="text-[16px] text-[#cedbf5] mt-[14px] max-w-[720px] mx-auto leading-relaxed">{tagline}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-[20px] py-[50px] grid grid-cols-1 lg:grid-cols-5 gap-[30px]">
        {/* Info */}
        <div className="lg:col-span-2 flex flex-col gap-[16px]">
          {/* Address */}
          <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[22px] flex items-start gap-[16px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
            <div className="w-[48px] h-[48px] rounded-[14px] bg-[var(--color-primary)]/10 flex items-center justify-center text-[22px] shrink-0">📍</div>
            <div>
              <div className="text-[12px] tracking-[1px] uppercase text-[var(--color-text-secondary)]">Address</div>
              <div className="text-[16px] text-[var(--color-bg-secondary)] font-medium">{address}</div>
            </div>
          </div>

          {/* Phones */}
          {phones && phones.length > 0 && (
            <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[22px] flex items-start gap-[16px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[var(--color-primary)]/10 flex items-center justify-center text-[22px] shrink-0">📞</div>
              <div>
                <div className="text-[12px] tracking-[1px] uppercase text-[var(--color-text-secondary)]">Contact No</div>
                <div className="flex flex-col gap-[2px] mt-[2px]">
                  {phones.map((p: string) => (
                    <a key={p} href={`tel:${p}`} className="text-[16px] text-[var(--color-bg-secondary)] font-medium hover:text-[var(--color-primary)]">{p}</a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[22px] flex items-start gap-[16px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
            <div className="w-[48px] h-[48px] rounded-[14px] bg-[var(--color-primary)]/10 flex items-center justify-center text-[22px] shrink-0">📧</div>
            <div className="min-w-0">
              <div className="text-[12px] tracking-[1px] uppercase text-[var(--color-text-secondary)]">Email Us</div>
              <a href={`mailto:${email}`} className="text-[16px] text-[var(--color-bg-secondary)] font-medium hover:text-[var(--color-primary)] break-words">{email}</a>
            </div>
          </div>

          {/* Socials */}
          <div className="bg-white rounded-[20px] border border-[#ece5d5] p-[22px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
            <div className="text-[12px] tracking-[1px] uppercase text-[var(--color-text-secondary)] mb-[12px]">Social Handles</div>
            <div className="flex flex-wrap gap-[10px]">
              {socialList.map((s) => {
                const url = socials?.[s.key];
                return url ? (
                  <a key={s.key} href={url} target="_blank" rel="noopener noreferrer" title={s.label} className="w-[42px] h-[42px] rounded-[12px] bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-[18px] transition-colors">{s.icon}</a>
                ) : (
                  <span key={s.key} title={`${s.label} (link coming soon)`} className="w-[42px] h-[42px] rounded-[12px] bg-[#f0eadd] flex items-center justify-center text-[18px] opacity-50">{s.icon}</span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[24px] border border-[#ece5d5] p-[28px]" style={{ boxShadow: "rgba(40, 63, 116, 0.08) 0px 6px 30px 0px" }}>
            <h4 className="!text-[20px] text-[var(--color-bg-secondary)] mb-[6px]">Send a Message</h4>
            <p className="text-[14px] text-[var(--color-text-secondary)] mb-[20px]">We&apos;ll get back to you as soon as possible.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
