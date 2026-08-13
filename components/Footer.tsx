import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-secondary)] text-white mt-auto">
      <div className="max-w-[1200px] mx-auto px-[20px] py-[60px] grid grid-cols-1 md:grid-cols-3 gap-[40px]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-[12px] mb-[18px]">
            <Image
              src="/logo.png"
              alt={siteConfig.shortName + " logo"}
              width={56}
              height={56}
              className="object-contain"
            />
            <h4 className="!text-white !text-[22px] font-[family-name:var(--font-heading)]">
              {siteConfig.shortName}
            </h4>
          </div>
          <p className="text-[15px] leading-relaxed text-[#cedbf5] max-w-[300px]">
            {siteConfig.description}
          </p>
        </div>
        {/* Quick links */}
        <div>
          <h4 className="!text-white !text-[18px] mb-[16px] font-[family-name:var(--font-heading)]">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-[10px]">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[15px] text-[#cedbf5] hover:text-[var(--color-primary)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Contact */}
        <div>
          <h4 className="!text-white !text-[18px] mb-[16px] font-[family-name:var(--font-heading)]">
            Contact
          </h4>
          <ul className="flex flex-col gap-[10px] text-[15px] text-[#cedbf5]">
            {siteConfig.contact.email && <li>{siteConfig.contact.email}</li>}
            {siteConfig.contact.phones?.[0] && <li>{siteConfig.contact.phones[0]}</li>}
            {siteConfig.contact.address && <li>{siteConfig.contact.address}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-[20px] py-[20px]">
          <div className="text-center text-[13px] text-[#cedbf5] mb-[16px]">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-[24px] text-[13px]">
            <Link
              href="/terms-and-conditions"
              className="text-[#cedbf5] hover:text-[var(--color-primary)] transition-colors"
            >
              Terms & Conditions
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/privacy-policy"
              className="text-[#cedbf5] hover:text-[var(--color-primary)] transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}