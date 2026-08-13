export default function TermsAndConditionsPage() {
  const sections = [
    {
      title: "1. Introduction",
      content: "Welcome to SPVBS.in, a closed community platform of Sri Sri Nikhil Utkal Saiba Panchal Viswa Brahmin Samaj. These Terms and Conditions govern your access to and use of our platform. By accessing SPVBS.in, you agree to be bound by these Terms."
    },
    {
      title: "2. Membership Eligibility",
      content: "Access to SPVBS.in is restricted to members of the Sri Sri Nikhil Utkal Saiba Panchal Viswa Brahmin Samaj community. You must be at least 18 years of age or have parental/guardian consent. Membership is granted upon admin approval and verification of community affiliation."
    },
    {
      title: "3. User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account credentials. Do not share your login information with third parties. You are accountable for all activities conducted through your account and must notify us immediately of any unauthorized access."
    },
    {
      title: "4. Prohibited Conduct",
      content: "Users must not post offensive or defamatory content, harass other members, engage in fraudulent activities, attempt to compromise platform security, violate privacy or intellectual property rights, or spam other members. Violation of these terms may result in account suspension or termination."
    },
    {
      title: "5. Content Ownership & Intellectual Property",
      content: "All content on SPVBS.in is the property of Sri Sri Nikhil Utkal Saiba Panchal Viswa Brahmin Samaj. User-generated content remains owned by users, but by posting on our platform, users grant us a non-exclusive license to display and use such content for community purposes."
    },
    {
      title: "6. Limitation of Liability",
      content: "SPVBS.in is provided on an 'as-is' basis. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform, including loss of data or service interruptions beyond our control."
    },
    {
      title: "7. Privacy & Data Protection",
      content: "Your use of SPVBS.in is governed by our Privacy Policy. Please review it to understand how we collect, use, and protect your personal information. By using SPVBS.in, you consent to the collection and use of your data as outlined in the Privacy Policy."
    },
    {
      title: "8. Account Termination",
      content: "We reserve the right to suspend or terminate your account if you violate these Terms, engage in prohibited conduct, your membership status changes, or upon your request. Upon termination, your access to the platform will be immediately revoked."
    },
    {
      title: "9. Modifications to Terms",
      content: "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of SPVBS.in following revisions means you accept and agree to the changes."
    },
    {
      title: "10. Governing Law & Jurisdiction",
      content: "These Terms and Conditions are governed by the laws of India. Any disputes arising from your use of SPVBS.in shall be resolved through mutual discussion or appropriate legal channels in India."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ee]">
      {/* Hero */}
      <div className="bg-[var(--color-bg-secondary)] py-[60px] px-[20px]">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[16px]">Legal</div>
          <h1 className="!text-[38px] !text-white font-[family-name:var(--font-heading)] leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-[17px] text-[#cedbf5] mt-[18px] leading-relaxed">
            Please read these terms carefully before using SPVBS.in
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
          <div className="text-[13px] tracking-[3px] uppercase text-[var(--color-primary)] font-medium mb-[16px]">Questions?</div>
          <h3 className="!text-[24px] !text-white font-[family-name:var(--font-heading)] mb-[20px]">
            Get in Touch
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
