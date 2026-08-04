"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Determine what approval powers the current user has for a given taluka.
async function getApprovalContext(marriageTaluka: string | null) {
  const user = await getCurrentUser();
  if (!user) return { user: null };

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  // Fetch the user's committee assignments
  const assignments = await prisma.committeeAssignment.findMany({
    where: { userId: user.id },
  });

  // Only President/Secretary designations can approve
  const approverDesignations = ["PRESIDENT", "SECRETARY"];

  // Taluka approver: a President/Secretary in a TALUKA committee for THIS taluka
  const canApproveTaluka = assignments.some(
    (a) =>
      a.level === "TALUKA" &&
      approverDesignations.includes(a.designation) &&
      (a.taluka === marriageTaluka || !marriageTaluka)
  );

  // Central approver: a President/Secretary in a CENTRAL committee
  const canApproveCentral = assignments.some(
    (a) => a.level === "CENTRAL" && approverDesignations.includes(a.designation)
  );

  return { user, isSuperAdmin, canApproveTaluka, canApproveCentral };
}

export async function approveMarriage(marriageId: string, level: "TALUKA" | "CENTRAL" | "ADMIN") {
  const marriage = await prisma.marriagePermission.findUnique({ where: { id: marriageId } });
  if (!marriage) return { error: "Application not found" };

  const ctx = await getApprovalContext(marriage.taluka);
  if (!ctx.user) return { error: "Please log in" };

  // Verify the user has the right power for this level
  if (level === "TALUKA" && !ctx.canApproveTaluka) return { error: "You are not a taluka approver for this application." };
  if (level === "CENTRAL" && !ctx.canApproveCentral) return { error: "You are not a central committee approver." };
  if (level === "ADMIN" && !ctx.isSuperAdmin) return { error: "Only the admin can give admin approval." };

  // Build a readable approver snapshot: "Name • Designation • Taluka/Village"
  const approverFamily = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: ctx.user.id },
    select: { familyName: true, taluka: true, villageTown: true },
  });
  const approverAssignments = await prisma.committeeAssignment.findMany({ where: { userId: ctx.user.id } });
  const desigText: Record<string, string> = {
    PRESIDENT: "President", SECRETARY: "Secretary", JOINT_SECRETARY: "Joint Secretary",
    CASHIER: "Cashier", MEMBER: "Member",
  };
  function labelFor(lvl: "TALUKA" | "CENTRAL") {
    const name = approverFamily?.familyName || ctx.user!.email || "Unknown";
    if (ctx.isSuperAdmin && lvl === "ADMIN") return `${name} • Super Admin`;
    const a = approverAssignments.find((x) => x.level === lvl && ["PRESIDENT", "SECRETARY"].includes(x.designation));
    const desig = a ? (desigText[a.designation] || a.designation) : "Approver";
    const place = a?.taluka || approverFamily?.taluka || approverFamily?.villageTown || "";
    return `${name} • ${desig}${place ? ` • ${place}` : ""}`;
  }
  function adminLabel() {
    const name = approverFamily?.familyName || ctx.user!.email || "Admin";
    const place = approverFamily?.taluka || approverFamily?.villageTown || "";
    return `${name} • Super Admin${place ? ` • ${place}` : ""}`;
  }

  const data: any = {};
  if (level === "TALUKA") { data.talukaApproved = true; data.talukaApprovedBy = labelFor("TALUKA"); }
  if (level === "CENTRAL") { data.centralApproved = true; data.centralApprovedBy = labelFor("CENTRAL"); }
  if (level === "ADMIN") { data.adminApproved = true; data.adminApprovedBy = adminLabel(); }

  // Update, then check if all three are now approved
  const updated = await prisma.marriagePermission.update({ where: { id: marriageId }, data });
  if (updated.talukaApproved && updated.centralApproved && updated.adminApproved) {
    await prisma.marriagePermission.update({ where: { id: marriageId }, data: { status: "APPROVED" } });
  }

  revalidatePath("/admin/marriage");
  revalidatePath("/dashboard/marriage");
  return { success: true };
}

export async function rejectMarriage(marriageId: string, level: "TALUKA" | "CENTRAL" | "ADMIN", reason: string) {
  const marriage = await prisma.marriagePermission.findUnique({ where: { id: marriageId } });
  if (!marriage) return { error: "Application not found" };

  const ctx = await getApprovalContext(marriage.taluka);
  if (!ctx.user) return { error: "Please log in" };

  if (level === "TALUKA" && !ctx.canApproveTaluka) return { error: "Not authorized." };
  if (level === "CENTRAL" && !ctx.canApproveCentral) return { error: "Not authorized." };
  if (level === "ADMIN" && !ctx.isSuperAdmin) return { error: "Not authorized." };

  await prisma.marriagePermission.update({
    where: { id: marriageId },
    data: { status: "REJECTED", rejectionReason: reason.trim() || "Rejected" },
  });

  revalidatePath("/admin/marriage");
  revalidatePath("/dashboard/marriage");
  return { success: true };
}

// Fetch full details of one application, with signed URLs for photos/signatures
export async function getMarriageDetails(marriageId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Please log in" };

  const m = await prisma.marriagePermission.findUnique({ where: { id: marriageId } });
  if (!m) return { error: "Not found" };

  // Access: super admin, any committee approver, or the submitter
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const assignments = await prisma.committeeAssignment.findMany({ where: { userId: user.id } });
  const isCommittee = assignments.length > 0;
  const isSubmitter = m.submittedByUserId === user.id;
  if (!isSuperAdmin && !isCommittee && !isSubmitter) return { error: "Not authorized" };

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  async function signed(path: string | null) {
    if (!path) return null;
    const { data } = await supabase.storage.from("marriage-documents").createSignedUrl(path, 600);
    return data?.signedUrl || null;
  }

  async function signWitnesses(list: any) {
    if (!Array.isArray(list)) return [];
    return Promise.all(list.map(async (w: any) => ({ name: w.name, url: await signed(w.signaturePath) })));
  }

  return {
    success: true,
    details: {
      groom: {
        name: m.groomName, father: m.groomFather, age: m.groomAge, education: m.groomEducation,
        village: m.groomVillage, post: m.groomPosa, bhaya: m.groomBhaya, district: m.groomDistrict,
        phone: m.groomPhone, photoUrl: await signed(m.groomPhotoPath),
        witnesses: await signWitnesses(m.groomWitnesses),
      },
      bride: {
        name: m.brideName, father: m.brideFather, age: m.brideAge, education: m.brideEducation,
        village: m.brideVillage, post: m.bridePosa, bhaya: m.brideBhaya, district: m.brideDistrict,
        phone: m.bridePhone, photoUrl: await signed(m.bridePhotoPath),
        witnesses: await signWitnesses(m.brideWitnesses),
      },
      marriageDate: m.marriageDate, taluka: m.taluka, declaration: m.declaration,
    },
  };
}
