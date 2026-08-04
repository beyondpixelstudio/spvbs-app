"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { sendContactMessage } from "@/app/actions/contact";
import { TALUKAS } from "@/lib/site-config";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!taluka.trim()) { setError("Please select your taluka."); return; }
    if (!village.trim()) { setError("Please enter your village."); return; }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (!subject.trim()) { setError("Please enter your query / subject."); return; }
    setLoading(true);
    const res = await sendContactMessage({ name, taluka, village, phone, email, subject, message });
    setLoading(false);
    if (res?.error) { setError(res.error); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center py-[20px]">
        <div className="w-[56px] h-[56px] rounded-full bg-[var(--color-extra-green)]/15 flex items-center justify-center mx-auto mb-[16px] text-[26px]">✓</div>
        <h4 className="!text-[20px] text-[var(--color-bg-secondary)] mb-[8px]">Message sent</h4>
        <p className="text-[15px] text-[var(--color-text)]">Thank you for reaching out. We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  const selectClass = "w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] cursor-pointer";

  return (
    <div className="flex flex-col gap-[16px]">
      <Input id="name" label="Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[14px] font-medium text-[var(--color-text)]">Taluka *</label>
          <select value={taluka} onChange={(e) => setTaluka(e.target.value)} className={selectClass}>
            <option value="">Select Taluka</option>
            {TALUKAS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Input id="village" label="Village *" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="List / Village" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Input id="phone" label="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number" />
        <Input id="email" label="E-mail (Optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>

      <Input id="subject" label="Query / Subject *" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What is this about?" />

      <div className="flex flex-col gap-[8px]">
        <label className="text-[14px] font-medium text-[var(--color-text)]">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write your message (optional)..."
          className="w-full rounded-[12px] border border-[#ece5d5] bg-white px-[14px] py-[11px] text-[15px] outline-none focus:border-[var(--color-primary)] resize-y"
        />
      </div>

      {error && (
        <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px]">{error}</p>
      )}
      <div>
        <Button variant="primary" onClick={handleSubmit}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
}
