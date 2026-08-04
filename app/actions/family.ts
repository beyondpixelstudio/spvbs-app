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

export async function addFamilyMember(input: MemberInput) {
  const familyUnitId = await getMyFamilyUnitId();
  if (!familyUnitId) return { error: "Set up your family first" };
  if (!input.fullName.trim()) return { error: "Name is required" };

  await prisma.familyMember.create({
    data: {
      familyUnitId,
      relation: input.relation || "Other",
      fullName: input.fullName.trim(),
      gender: input.gender ? (input.gender as any) : null,
      dob: input.dob ? new Date(input.dob) : null,
      maritalStatus: input.maritalStatus ? (input.maritalStatus as any) : null,
      qualification: input.qualification || null,
      occupation: input.occupation || null,
      mobileNumber: input.mobileNumber || null,
      bloodGroup: input.bloodGroup || null,
      currentStatus: input.currentStatus ? (input.currentStatus as any) : null,
      villageTown: input.villageTown || null,
      visibility: input.visibility ? (input.visibility as any) : "MEMBERS_ONLY",
    },
  });

  revalidatePath("/dashboard/family");
  return { success: true };
}

export async function updateFamilyMember(memberId: string, input: MemberInput) {
  const familyUnitId = await getMyFamilyUnitId();
  if (!familyUnitId) return { error: "Not authorized" };

  // Ensure the member belongs to this family (security)
  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyUnitId },
  });
  if (!member) return { error: "Member not found" };

  await prisma.familyMember.update({
    where: { id: memberId },
    data: {
      relation: input.relation || member.relation,
      fullName: input.fullName.trim() || member.fullName,
      gender: input.gender ? (input.gender as any) : null,
      dob: input.dob ? new Date(input.dob) : null,
      maritalStatus: input.maritalStatus ? (input.maritalStatus as any) : null,
      qualification: input.qualification || null,
      occupation: input.occupation || null,
      mobileNumber: input.mobileNumber || null,
      bloodGroup: input.bloodGroup || null,
      currentStatus: input.currentStatus ? (input.currentStatus as any) : null,
      villageTown: input.villageTown || null,
      visibility: input.visibility ? (input.visibility as any) : member.visibility,
    },
  });

  revalidatePath("/dashboard/family");
  return { success: true };
}

export async function deleteFamilyMember(memberId: string) {
  const familyUnitId = await getMyFamilyUnitId();
  if (!familyUnitId) return { error: "Not authorized" };

  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyUnitId },
  });
  if (!member) return { error: "Member not found" };
  if (member.relation === "Head") return { error: "Cannot delete the Head of Family" };

  await prisma.familyMember.delete({ where: { id: memberId } });

  revalidatePath("/dashboard/family");
  return { success: true };
}

// Toggle a member's visibility (public / members_only / hidden)
export async function setMemberVisibility(memberId: string, visibility: string) {
  const familyUnitId = await getMyFamilyUnitId();
  if (!familyUnitId) return { error: "Not authorized" };

  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyUnitId },
  });
  if (!member) return { error: "Member not found" };

  await prisma.familyMember.update({
    where: { id: memberId },
    data: { visibility: visibility as any },
  });

  revalidatePath("/dashboard/family");
  return { success: true };
}
