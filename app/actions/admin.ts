"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Guard: ensure the caller is an admin
async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "SUPER_ADMIN" && user.role !== "TALUKA_ADMIN") return null;
  return user;
}

export async function approveFamily(userId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  await prisma.user.update({
    where: { id: userId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/approvals");
  revalidatePath("/admin");
  return { success: true };
}

export async function rejectFamily(userId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  // Suspended = rejected/blocked (kept in DB, not deleted)
  await prisma.user.update({
    where: { id: userId },
    data: { status: "SUSPENDED" },
  });

  revalidatePath("/admin/approvals");
  revalidatePath("/admin");
  return { success: true };
}

// Re-approve a previously suspended/rejected family
export async function reactivateFamily(userId: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  await prisma.user.update({
    where: { id: userId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/approvals");
  revalidatePath("/admin");
  return { success: true };
}
