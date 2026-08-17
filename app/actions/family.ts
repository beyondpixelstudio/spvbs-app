"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type FamilyBasicInput = {
  familyName: string;
  taluka: string;
  villageTown: string;
  // Head of family personal details
  headGender?: string;
  headDob?: string;
  headQualification?: string;
  headOccupation?: string;
  headMaritalStatus?: string;
  headMobile?: string;
  headBloodGroup?: string;
  headCurrentStatus?: string;
};

// Create or update the family unit + the Head member record
export async function saveFamilyBasics(input: FamilyBasicInput) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const supabaseName = input.familyName.trim();
  if (!supabaseName) return { error: "Family name is required" };

  // Upsert the family unit
  const familyUnit = await prisma.familyUnit.upsert({
    where: { familyHeadUserId: user.id },
    update: {
      familyName: supabaseName,
      taluka: input.taluka.trim(),
      villageTown: input.villageTown.trim(),
    },
    create: {
      familyName: supabaseName,
      familyHeadUserId: user.id,
      taluka: input.taluka.trim(),
      villageTown: input.villageTown.trim(),
    },
  });

  // Find existing Head member (relation = "Head") for this family
  const existingHead = await prisma.familyMember.findFirst({
    where: { familyUnitId: familyUnit.id, relation: "Head" },
  });

  const headData = {
    familyUnitId: familyUnit.id,
    relation: "Head",
    fullName: supabaseName,
    gender: input.headGender ? (input.headGender as any) : null,
    dob: input.headDob ? new Date(input.headDob) : null,
    maritalStatus: input.headMaritalStatus ? (input.headMaritalStatus as any) : null,
    qualification: input.headQualification || null,
    occupation: input.headOccupation || null,
    mobileNumber: input.headMobile || null,
    bloodGroup: input.headBloodGroup || null,
    currentStatus: input.headCurrentStatus ? (input.headCurrentStatus as any) : null,
    villageTown: input.villageTown.trim() || null,
    visibility: "PUBLIC" as const,
  };

  if (existingHead) {
    await prisma.familyMember.update({
      where: { id: existingHead.id },
      data: headData,
    });
  } else {
    await prisma.familyMember.create({ data: headData });
  }

  revalidatePath("/dashboard/family");
  revalidatePath("/dashboard");
  return { success: true, familyUnitId: familyUnit.id };
}

// ==================== MEMBER ACTIONS ====================

type MemberInput = {
  relation: string;
  fullName: string;
  gender?: string;
  dob?: string;
  maritalStatus?: string;
  qualification?: string;
  occupation?: string;
  mobileNumber?: string;
  bloodGroup?: string;
  currentStatus?: string;
  villageTown?: string;
  visibility?: string;
};

// Helper: get the logged-in user's family unit id (or null)
async function getMyFamilyUnitId() {
  const user = await getCurrentUser();
  if (!user) return null;
  const fu = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    select: { id: true },
  });
  return fu?.id ?? null;
}

// Adding a member no longer creates it directly — it goes to Super Admin for approval.
export async function addFamilyMember(input: MemberInput) {
  const familyUnitId = await getMyFamilyUnitId();
  if (!familyUnitId) return { error: "Set up your family first" };
  if (!input.fullName.trim()) return { error: "Name is required" };

  const user = await getCurrentUser();
  if (!user) return { error: "Not authorized" };

  await prisma.memberDeletionRequest.create({
    data: {
      requestType: "ADD",
      memberId: null,
      memberName: input.fullName.trim(),
      relation: input.relation || "Other",
      familyUnitId,
      requestedById: user.id,
      proposedChanges: {
        relation: input.relation || "Other",
        fullName: input.fullName.trim(),
        gender: input.gender || null,
        dob: input.dob || null,
        maritalStatus: input.maritalStatus || null,
        qualification: input.qualification || null,
        occupation: input.occupation || null,
        mobileNumber: input.mobileNumber || null,
        bloodGroup: input.bloodGroup || null,
        currentStatus: input.currentStatus || null,
        villageTown: input.villageTown || null,
      },
    },
  });

  revalidatePath("/dashboard/family");
  return { success: true, pendingApproval: true };
}

// Editing a member no longer updates it directly — it goes to Super Admin for approval.
export async function updateFamilyMember(memberId: string, input: MemberInput) {
  const familyUnitId = await getMyFamilyUnitId();
  if (!familyUnitId) return { error: "Not authorized" };

  // Ensure the member belongs to this family (security)
  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyUnitId },
  });
  if (!member) return { error: "Member not found" };

  const user = await getCurrentUser();
  if (!user) return { error: "Not authorized" };

  const existing = await prisma.memberDeletionRequest.findFirst({
    where: { memberId, status: "PENDING", requestType: "EDIT" },
  });
  if (existing) return { error: "An edit request for this member is already pending approval." };

  await prisma.memberDeletionRequest.create({
    data: {
      requestType: "EDIT",
      memberId,
      memberName: input.fullName.trim() || member.fullName,
      relation: input.relation || member.relation,
      familyUnitId,
      requestedById: user.id,
      proposedChanges: {
        relation: input.relation || member.relation,
        fullName: input.fullName.trim() || member.fullName,
        gender: input.gender || null,
        dob: input.dob || null,
        maritalStatus: input.maritalStatus || null,
        qualification: input.qualification || null,
        occupation: input.occupation || null,
        mobileNumber: input.mobileNumber || null,
        bloodGroup: input.bloodGroup || null,
        currentStatus: input.currentStatus || null,
        villageTown: input.villageTown || null,
      },
    },
  });

  revalidatePath("/dashboard/family");
  return { success: true, pendingApproval: true };
}

export async function deleteFamilyMember(memberId: string, reason?: string) {
  const familyUnitId = await getMyFamilyUnitId();
  if (!familyUnitId) return { error: "Not authorized" };

  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyUnitId },
  });
  if (!member) return { error: "Member not found" };
  if (member.relation === "Head") return { error: "Cannot delete the Head of Family" };

  const user = await getCurrentUser();
  if (!user) return { error: "Not authorized" };

  const existing = await prisma.memberDeletionRequest.findFirst({
    where: { memberId, status: "PENDING", requestType: "DELETE" },
  });
  if (existing) return { error: "A deletion request for this member is already pending approval." };

  await prisma.memberDeletionRequest.create({
    data: {
      requestType: "DELETE",
      memberId,
      memberName: member.fullName,
      relation: member.relation,
      familyUnitId,
      requestedById: user.id,
      reason: reason || null,
    },
  });

  revalidatePath("/dashboard/family");
  return { success: true, pendingApproval: true };
}

// Visibility is now controlled by Admins only — Family Heads can no longer change it.
export async function setMemberVisibility(memberId: string, visibility: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authorized" };
  if (user.role !== "SUPER_ADMIN" && user.role !== "TALUKA_ADMIN") {
    return { error: "Only admins can change member visibility." };
  }

  const member = await prisma.familyMember.findUnique({ where: { id: memberId } });
  if (!member) return { error: "Member not found" };

  await prisma.familyMember.update({
    where: { id: memberId },
    data: { visibility: visibility as any },
  });

  revalidatePath("/dashboard/family");
  revalidatePath("/members");
  return { success: true };
}
