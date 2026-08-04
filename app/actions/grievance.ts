"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function submitGrievance(input: {
  subject: string;
  description: string;
  category: string;
  againstWhom: string;
  anonymous: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  if (!input.subject.trim()) return { error: "Subject is required" };
  if (!input.description.trim()) return { error: "Please describe your grievance" };
  if (!input.category) return { error: "Please select a category" };

  let submittedByMemberId: string | null = null;
  if (!input.anonymous) {
    const family = await prisma.familyUnit.findUnique({
      where: { familyHeadUserId: user.id },
      include: { members: { where: { relation: "Head" }, take: 1 } },
    });
    submittedByMemberId = family?.members[0]?.id ?? null;
  }

  await prisma.grievance.create({
    data: {
      subject: input.subject.trim(),
      description: input.description.trim(),
      category: input.category as any,
      againstWhom: input.againstWhom.trim() || null,
      submittedByMemberId,
      status: "OPEN",
    },
  });

  revalidatePath("/dashboard/grievance");
  revalidatePath("/admin/grievances");
  return { success: true };
}

export async function updateGrievance(
  grievanceId: string,
  input: { status: string; adminNotes: string }
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (user.role !== "SUPER_ADMIN" && user.role !== "TALUKA_ADMIN") {
    return { error: "Not authorized" };
  }

  await prisma.grievance.update({
    where: { id: grievanceId },
    data: {
      status: input.status as any,
      adminNotes: input.adminNotes.trim() || null,
    },
  });

  revalidatePath("/admin/grievances");
  revalidatePath("/dashboard/grievance");
  return { success: true };
}

// ==================== COMMENTS & WITHDRAW ====================

import { createClient } from "@/lib/supabase/server";

// Add a comment (with optional image) to a grievance
export async function addGrievanceComment(
  grievanceId: string,
  formData: FormData
) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const body = (formData.get("body") as string)?.trim();
  const file = formData.get("file") as File | null;

  if (!body && (!file || file.size === 0)) {
    return { error: "Write a message or attach an image." };
  }

  const isAdmin = user.role === "SUPER_ADMIN" || user.role === "TALUKA_ADMIN";

  // Access check: admins can comment on any; members only on their own
  const grievance = await prisma.grievance.findUnique({
    where: { id: grievanceId },
    include: { submittedByMember: { include: { familyUnit: true } } },
  });
  if (!grievance) return { error: "Grievance not found" };

  if (!isAdmin) {
    const ownerUserId = grievance.submittedByMember?.familyUnit?.familyHeadUserId;
    if (ownerUserId !== user.id) return { error: "Not authorized" };
  }

  // Handle image upload
  let attachmentUrl: string | null = null;
  if (file && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Image must be under 5MB." };
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return { error: "Only JPG or PNG images are allowed." };
    }
    const supabase = await createClient();
    const ext = file.type === "image/png" ? "png" : "jpg";
    const path = `${grievanceId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("grievance-attachments")
      .upload(path, file, { contentType: file.type });
    if (uploadError) return { error: "Upload failed: " + uploadError.message };

    const { data } = supabase.storage
      .from("grievance-attachments")
      .getPublicUrl(path);
    attachmentUrl = data.publicUrl;
  }

  await prisma.grievanceComment.create({
    data: {
      grievanceId,
      authorUserId: user.id,
      authorRole: isAdmin ? "ADMIN" : "MEMBER",
      body: body || "",
      attachmentUrl,
    },
  });

  // If admin replies to an OPEN grievance, move it to IN_PROGRESS
  if (isAdmin && grievance.status === "OPEN") {
    await prisma.grievance.update({
      where: { id: grievanceId },
      data: { status: "IN_PROGRESS" },
    });
  }

  revalidatePath("/dashboard/grievance");
  revalidatePath("/admin/grievances");
  return { success: true };
}

// Raiser withdraws (or closes) their own grievance
export async function withdrawGrievance(grievanceId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const grievance = await prisma.grievance.findUnique({
    where: { id: grievanceId },
    include: { submittedByMember: { include: { familyUnit: true } } },
  });
  if (!grievance) return { error: "Grievance not found" };

  const ownerUserId = grievance.submittedByMember?.familyUnit?.familyHeadUserId;
  if (ownerUserId !== user.id) return { error: "Not authorized" };

  await prisma.grievance.update({
    where: { id: grievanceId },
    data: { status: "WITHDRAWN" },
  });

  revalidatePath("/dashboard/grievance");
  revalidatePath("/admin/grievances");
  return { success: true };
}

// Raiser appeals a RESOLVED grievance (reopens it as APPEALED)
export async function appealGrievance(grievanceId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const grievance = await prisma.grievance.findUnique({
    where: { id: grievanceId },
    include: { submittedByMember: { include: { familyUnit: true } } },
  });
  if (!grievance) return { error: "Grievance not found" };

  const ownerUserId = grievance.submittedByMember?.familyUnit?.familyHeadUserId;
  if (ownerUserId !== user.id) return { error: "Not authorized" };
  if (grievance.status !== "RESOLVED") {
    return { error: "Only resolved grievances can be appealed" };
  }

  await prisma.grievance.update({
    where: { id: grievanceId },
    data: { status: "APPEALED" },
  });

  revalidatePath("/dashboard/grievance");
  revalidatePath("/admin/grievances");
  return { success: true };
}
