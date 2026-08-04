"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "SUPER_ADMIN" && user.role !== "TALUKA_ADMIN") return null;
  return user;
}

export async function markMessageRead(id: string, isRead: boolean) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized." };
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  return { success: true };
}
