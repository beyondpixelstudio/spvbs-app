"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Verify the member belongs to the logged-in user's family
async function verifyMemberOwnership(memberId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const member = await prisma.familyMember.findFirst({
    where: {
      id: memberId,
      familyUnit: { familyHeadUserId: user.id },
    },
  });
  return member;
}

export async function saveKundli(
  memberId: string,
  input: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    notes: string;
    visibility: string;
  }
) {
  const member = await verifyMemberOwnership(memberId);
  if (!member) return { error: "Not authorized" };

  const chartData = input.notes.trim() ? { notes: input.notes.trim() } : undefined;

  await prisma.janamKundli.upsert({
    where: { familyMemberId: memberId },
    update: {
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      birthTime: input.birthTime || null,
      birthPlace: input.birthPlace || null,
      chartData: chartData ?? undefined,
      visibility: input.visibility as any,
    },
    create: {
      familyMemberId: memberId,
      birthDate: input.birthDate ? new Date(input.birthDate) : null,
      birthTime: input.birthTime || null,
      birthPlace: input.birthPlace || null,
      chartData: chartData ?? undefined,
      visibility: (input.visibility as any) || "HIDDEN",
    },
  });

  revalidatePath("/dashboard/family/kundli");
  return { success: true };
}

export async function deleteKundli(memberId: string) {
  const member = await verifyMemberOwnership(memberId);
  if (!member) return { error: "Not authorized" };

  await prisma.janamKundli.deleteMany({
    where: { familyMemberId: memberId },
  });

  revalidatePath("/dashboard/family/kundli");
  return { success: true };
}
