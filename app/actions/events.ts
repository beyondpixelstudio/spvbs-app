"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Admin OR an events-capable committee member (Advisor/Core, President/Secretary)
async function requireEventManager() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role === "SUPER_ADMIN" || user.role === "TALUKA_ADMIN") return user;
  const assignments = await prisma.committeeAssignment.findMany({ where: { userId: user.id } });
  const canManage = assignments.some(
    (a) =>
      ["ADVISOR", "CORE"].includes(a.type) &&
      ["PRESIDENT", "SECRETARY"].includes(a.designation)
  );
  return canManage ? user : null;
}

// ===== ADMIN: create / edit / delete events =====
export async function createEvent(input: {
  title: string;
  description: string;
  dateTime: string;
  location: string;
  taluka: string;
}) {
  const admin = await requireEventManager();
  if (!admin) return { error: "Not authorized" };
  if (!input.title.trim()) return { error: "Title is required" };
  if (!input.dateTime) return { error: "Date & time is required" };

  await prisma.event.create({
    data: {
      title: input.title.trim(),
      description: input.description.trim() || null,
      dateTime: new Date(input.dateTime),
      location: input.location.trim() || null,
      taluka: input.taluka.trim() || null,
      createdByAdminId: admin.id,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

export async function updateEvent(
  eventId: string,
  input: {
    title: string;
    description: string;
    dateTime: string;
    location: string;
    taluka: string;
  }
) {
  const admin = await requireEventManager();
  if (!admin) return { error: "Not authorized" };

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title: input.title.trim(),
      description: input.description.trim() || null,
      dateTime: new Date(input.dateTime),
      location: input.location.trim() || null,
      taluka: input.taluka.trim() || null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

export async function deleteEvent(eventId: string) {
  const admin = await requireEventManager();
  if (!admin) return { error: "Not authorized" };

  await prisma.event.delete({ where: { id: eventId } });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}
