export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Introduction",
      content: "Sri Sri Nikhil Utkal Saiba Panchal Viswa Brahmin Samaj (SPVBS) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use SPVBS.in. Please read this policy carefully. By using SPVBS.in, you consent to the collection and use of your data as outlined here."
    },
    {
      title: "2. Information We Collect",
      content: "We collect personal information you voluntarily provide during registration including name, email, phone, family history, date of birth, and marital status. We also collect family information with consent, event participation details, committee roles, and any profile content you choose to share. Automatically collected information includes login timestamps, IP address, browser type, device information, and usage data through analytics."
    },
    {
      title: "3. How We Use Your Information",
      content: "We use your information to create and manage your account, facilitate community events, maintain the directory, manage committee roles, send administrative notifications, improve platform functionality, ensure Terms compliance, and analyze usage for continuous improvement. Your data helps us serve the community better while protecting member privacy."
    },
    {
      title: "4. Information Sharing & Disclosure",
      content: "Your profile information may be visible to other verified community members through the directory. We do not sell your data to third parties. We only share information when required by law, necessary to protect our rights, or with your explicit consent. Service providers helping us operate SPVBS.in (like hosting providers) receive information under strict data protection agreements."
    },
    {
      title: "5. Data Security",
      content: "We implement industry-standard security measures including HTTPS encryption, secure password authentication via Supabase Auth, regular security audits, and role-based access controls. However, no transmission over the internet is 100% secure. Please report any suspected breaches immediately."
    },
    {
      title: "6. Your Rights & Choices",
      content: "You have the right to access your personal information, request corrections, delete your account, opt out of communications, and request your data in portable format. To exercise these rights, contact us at spvbs57@gmail.com. We will respond to legitimate requests within 30 days."
    },
    {
      title: "7. Data Retention",
      content: "We retain your personal information as long as your account is active. Upon account deletion, we will remove your data within 30 days, except where required by law or for legitimate business purposes. Historical records may be retained for audit and compliance purposes."
    },
    {
      title: "8. Children's Privacy",
      content: "SPVBS.in is not intended for users under 18 years. We do not knowingly collect personal information from children under 18. If we become aware a child has provided information, we will delete it and terminate the account. Parents who believe their child provided information should contact us immediately."
    },
    {
      title: "9. Third-Party Links & Services",
      content: "SPVBS.in may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review privacy policies of external sites before providing information. Our policy only covers SPVBS.in."
    },
    {
      title: "10. Updates to This Privacy Policy",
      content: "We may update this Privacy Policy to reflect changes in practices or legal requirements. Significant changes will be posted on SPVBS.in with an updated date. Continued use constitutes acceptance of the updated policy."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {/* Hero */}
      <div className="bg-[var(--color-bg-secondary)] py-[60px] px-[20px]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[16px]">Legal</div>
          <h1 className="!text-[38px] !text-white font-[family-name:var(--font-heading)] leading-tight">
            Privacy Policy
          </h1>
          <p className="text-[17px] text-[#cedbf5] mt-[18px] leading-relaxed">
            Your privacy matters to us. Learn how we protect your information.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-[20px] py-[50px]">
        {/* Content */}
        <div className="space-y-[24px]">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-[20px] border border-[#ece5d5] p-[28px]" style={{ boxShadow: "rgba(40, 63, 116, 0.06) 0px 4px 20px 0px" }}>
              <h3 className="!text-[20px] text-[var(--color-bg-secondary)] font-[family-name:var(--font-heading)] mb-[12px]">
                {section.title}
              </h3>
              <p className="text-[15px] text-[var(--color-text)] leading-[1.8]">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-[var(--color-bg-secondary)] rounded-[28px] p-[40px] text-center mt-[50px]">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[16px]">Data Protection</div>
          <h3 className="!text-[24px] !text-white font-[family-name:var(--font-heading)] mb-[20px]">
            Contact Our Privacy Team
          </h3>
          <div className="space-y-[12px] text-[15px] text-[#cedbf5]">
            <p><strong className="text-white">Email:</strong> spvbs57@gmail.com</p>
            <p><strong className="text-white">Phone:</strong> 7008341570 | 9937915203 | 8093770857</p>
            <p><strong className="text-white">Address:</strong> Laxmi Bazaar, Aska, Ganjam, Odisha</p>
          </div>
          <p className="text-[13px] text-[#a8b5d1] mt-[24px]">
            Last Updated: August 2026
          </p>
        </div>
      </div>
    </div>
  );
}
