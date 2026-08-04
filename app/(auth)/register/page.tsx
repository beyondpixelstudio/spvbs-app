"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CURRENT_STATUS_OPTIONS,
  BLOOD_GROUP_OPTIONS,
} from "@/lib/constants";
import { submitMembership } from "@/app/actions/membership";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Step 1: account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: personal details
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [qualification, setQualification] = useState("");
  const [occupation, setOccupation] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [mobile, setMobile] = useState("");
  const [taluka, setTaluka] = useState("");
  const [villageTown, setVillageTown] = useState("");

  function validateStep1(): boolean {
    setError("");
    if (!fullName.trim()) { setError("Full name is required."); return false; }
    if (!email.trim()) { setError("Email is required."); return false; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return false; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return false; }
    return true;
  }

  function validateStep2(): boolean {
    setError("");
    if (!gender) { setError("Please select gender."); return false; }
    if (!dob) { setError("Date of birth is required."); return false; }
    if (!maritalStatus) { setError("Please select marital status."); return false; }
    if (!occupation.trim()) { setError("Occupation is required."); return false; }
    if (!currentStatus) { setError("Please select current status."); return false; }
    if (!mobile.trim()) { setError("Mobile number is required."); return false; }
    if (!taluka.trim()) { setError("Taluka is required."); return false; }
    if (!villageTown.trim()) { setError("Village/Town is required."); return false; }
    return true;
  }

  function next() {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  }
  function back() { setError(""); setStep((s) => s - 1); }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const res = await submitMembership({
      fullName, email, password,
      gender, dob, maritalStatus, qualification, occupation,
      currentStatus, bloodGroup, mobile, taluka, villageTown,
    });

    setLoading(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-[64px] h-[64px] rounded-full bg-[var(--color-extra-green)]/15 flex items-center justify-center mx-auto mb-[20px] text-[30px]">✓</div>
        <h4 className="!text-[24px] text-[var(--color-bg-secondary)] mb-[12px]">Membership request submitted</h4>
        <p className="text-[16px] text-[var(--color-text)] mb-[24px]">
          Your details have been received. A committee member will review and approve your
          membership. You&apos;ll appear in the Members list once approved.
        </p>
        <Button href="/login" variant="primary" className="w-full">Go to Login</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-[8px] mb-[24px]">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex-1 flex items-center gap-[8px]">
            <div
              className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[13px] font-medium ${
                step >= n ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"
              }`}
            >
              {n}
            </div>
            {n < 3 && <div className={`flex-1 h-[2px] ${step > n ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}`} />}
          </div>
        ))}
      </div>

      <h4 className="!text-[24px] text-[var(--color-bg-secondary)] mb-[4px]">
        {step === 1 ? "Create your account" : step === 2 ? "Your details" : "Confirm & submit"}
      </h4>
      <p className="text-[15px] text-[var(--color-text-secondary)] mb-[24px]">
        {step === 1 ? "As the head of your family." : step === 2 ? "Basic details for your membership." : "Review before submitting."}
      </p>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-[16px]">
          <Input id="fullName" label="Head of Family — Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Rajesh Kumar Achary" />
          <Input id="email" label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input id="password" label="Password *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          <Input id="confirmPassword" label="Confirm Password *" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
          <Select id="gender" label="Gender *" options={GENDER_OPTIONS} value={gender} onChange={(e) => setGender(e.target.value)} />
          <Input id="dob" label="Date of Birth *" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <Select id="maritalStatus" label="Marital Status *" options={MARITAL_STATUS_OPTIONS} value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} />
          <Input id="qualification" label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="e.g. B.Com" />
          <Input id="occupation" label="Occupation *" value={occupation} onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Goldsmith" />
          <Select id="currentStatus" label="Current Status *" options={CURRENT_STATUS_OPTIONS} value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} />
          <Select id="bloodGroup" label="Blood Group" options={BLOOD_GROUP_OPTIONS} value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
          <Input id="mobile" label="Mobile Number *" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile" />
          <Input id="taluka" label="Taluka *" value={taluka} onChange={(e) => setTaluka(e.target.value)} placeholder="e.g. Aska" />
          <Input id="villageTown" label="Village / Town *" value={villageTown} onChange={(e) => setVillageTown(e.target.value)} placeholder="e.g. Aska" />
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="bg-[#faf8f3] border border-[#ece5d5] rounded-[16px] p-[20px] flex flex-col gap-[8px]">
          {[
            ["Name", fullName], ["Email", email], ["Gender", gender], ["DOB", dob],
            ["Marital Status", maritalStatus], ["Qualification", qualification || "—"],
            ["Occupation", occupation], ["Current Status", currentStatus],
            ["Blood Group", bloodGroup || "—"], ["Mobile", mobile],
            ["Taluka", taluka], ["Village/Town", villageTown],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-[12px] text-[14px] border-b border-[#ece5d5] pb-[6px]">
              <span className="text-[var(--color-text-secondary)]">{k}</span>
              <span className="text-[var(--color-text)] text-right">{v}</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-[14px] text-[var(--color-secondary)] bg-[var(--color-secondary)]/8 rounded-[12px] px-[14px] py-[10px] mt-[16px]">
          {error}
        </p>
      )}

      {/* Nav buttons */}
      <div className="flex gap-[12px] mt-[24px]">
        {step > 1 && <Button variant="outline" onClick={back}>Back</Button>}
        {step < 3 ? (
          <Button variant="primary" onClick={next} className="flex-1">Continue</Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            {loading ? "Submitting..." : "Submit membership"}
          </Button>
        )}
      </div>

      <p className="text-[15px] text-[var(--color-text-secondary)] text-center mt-[24px]">
        Already a member? <Link href="/login" className="text-[var(--color-primary)] font-medium">Login here</Link>
      </p>
    </div>
  );
}
