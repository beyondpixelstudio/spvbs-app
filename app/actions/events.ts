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
  rsvpCapacity: string;
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
      rsvpCapacity: input.rsvpCapacity ? parseInt(input.rsvpCapacity) : null,
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
    rsvpCapacity: string;
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
      rsvpCapacity: input.rsvpCapacity ? parseInt(input.rsvpCapacity) : null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

export async function deleteEvent(eventId: string) {
  const admin = await requireEventManager();
  if (!admin) return { error: "Not authorized" };

  // Remove RSVPs first (no cascade defined)
  await prisma.eventRSVP.deleteMany({ where: { eventId } });
  await prisma.event.delete({ where: { id: eventId } });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}

// ===== MEMBER: RSVP =====
export async function rsvpEvent(eventId: string, status: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Please log in" };

  // Get the user's Head member record (the one who RSVPs on behalf of family)
  const family = await prisma.familyUnit.findUnique({
    where: { familyHeadUserId: user.id },
    include: { members: { where: { relation: "Head" }, take: 1 } },
  });
  const memberId = family?.members[0]?.id;
  if (!memberId) return { error: "Please set up your family first" };

  if (status === "CANCELLED") {
    // Remove the RSVP entirely on cancel
    await prisma.eventRSVP.deleteMany({ where: { eventId, memberId } });
  } else {
    await prisma.eventRSVP.upsert({
      where: { eventId_memberId: { eventId, memberId } },
      update: { status: "GOING" },
      create: { eventId, memberId, status: "GOING" },
    });
  }

  revalidatePath("/events");
  revalidatePath("/dashboard/committee");
  revalidatePath("/admin/events");
  return { success: true };
}

// ===== ADMIN: mark attendance (check-in) =====
export async function toggleCheckIn(rsvpId: string, checkedIn: boolean) {
  const admin = await requireEventManager();
  if (!admin) return { error: "Not authorized" };

  await prisma.eventRSVP.update({
    where: { id: rsvpId },
    data: { checkedIn },
  });

  revalidatePath("/admin/events");
  return { success: true };
}

// Fetch RSVPs (attendees) for an event — for committee check-in
export async function getEventAttendees(eventId: string) {
  const admin = await requireEventManager();
  if (!admin) return { error: "Not authorized", attendees: [] };

  const rsvps = await prisma.eventRSVP.findMany({
    where: { eventId, status: "GOING" },
    include: {
      member: {
        include: { familyUnit: { select: { familyName: true, taluka: true } } },
      },
    },
    orderBy: { checkedIn: "desc" },
  });

  const attendees = rsvps.map((r) => ({
    rsvpId: r.id,
    name: r.member.fullName,
    family: r.member.familyUnit?.familyName || "",
    taluka: r.member.familyUnit?.taluka || "",
    checkedIn: r.checkedIn,
  }));

  return { success: true, attendees };
}
