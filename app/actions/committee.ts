"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Only the main Super Admin can assign/remove committee positions
async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "SUPER_ADMIN") return null;
  return user;
}

export async function assignCommittee(input: {
  userId: string;
  level: string;
  type: string;
  designation: string;
  taluka: string;
}) {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Only the Super Admin can assign committees." };

  if (!input.userId || !input.level || !input.type) {
    return { error: "Level and type are required." };
  }

  await prisma.committeeAssignment.create({
    data: {
      userId: input.userId,
      level: input.level as any,
      type: input.type as any,
      designation: (input.designation || "MEMBER") as any,
      taluka: input.level === "TALUKA" ? (input.taluka.trim() || null) : null,
    },
  });

  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  return { success: true };
}

export async function removeCommittee(assignmentId: string) {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Only the Super Admin can remove committees." };

  await prisma.committeeAssignment.delete({ where: { id: assignmentId } });

  revalidatePath("/admin/committee");
  revalidatePath("/committee");
  return { success: true };
}
