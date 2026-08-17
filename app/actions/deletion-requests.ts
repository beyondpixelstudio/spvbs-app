"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== "SUPER_ADMIN") return null;
  return user;
}

type ProposedChanges = {
  relation: string;
  fullName: string;
  gender?: string | null;
  dob?: string | null;
  maritalStatus?: string | null;
  qualification?: string | null;
  occupation?: string | null;
  mobileNumber?: string | null;
  bloodGroup?: string | null;
  currentStatus?: string | null;
  villageTown?: string | null;
};

export async function approveDeletionRequest(requestId: string) {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Not authorized" };

  const request = await prisma.memberDeletionRequest.findUnique({ where: { id: requestId } });
  if (!request) return { error: "Request not found" };
  if (request.status !== "PENDING") return { error: "This request has already been decided." };

  if (request.requestType === "DELETE") {
    if (request.memberId) {
      await prisma.familyMember.deleteMany({ where: { id: request.memberId } });
    }
  } else if (request.requestType === "ADD") {
    const c = request.proposedChanges as unknown as ProposedChanges | null;
    if (c) {
      await prisma.familyMember.create({
        data: {
          familyUnitId: request.familyUnitId,
          relation: c.relation || "Other",
          fullName: c.fullName,
          gender: c.gender ? (c.gender as any) : null,
          dob: c.dob ? new Date(c.dob) : null,
          maritalStatus: c.maritalStatus ? (c.maritalStatus as any) : null,
          qualification: c.qualification || null,
          occupation: c.occupation || null,
          mobileNumber: c.mobileNumber || null,
          bloodGroup: c.bloodGroup || null,
          currentStatus: c.currentStatus ? (c.currentStatus as any) : null,
          villageTown: c.villageTown || null,
          visibility: "MEMBERS_ONLY",
        },
      });
    }
  } else if (request.requestType === "EDIT") {
    const c = request.proposedChanges as unknown as ProposedChanges | null;
    if (c && request.memberId) {
      const existing = await prisma.familyMember.findUnique({ where: { id: request.memberId } });
      if (existing) {
        await prisma.familyMember.update({
          where: { id: request.memberId },
          data: {
            relation: c.relation || existing.relation,
            fullName: c.fullName || existing.fullName,
            gender: c.gender ? (c.gender as any) : null,
            dob: c.dob ? new Date(c.dob) : null,
            maritalStatus: c.maritalStatus ? (c.maritalStatus as any) : null,
            qualification: c.qualification || null,
            occupation: c.occupation || null,
            mobileNumber: c.mobileNumber || null,
            bloodGroup: c.bloodGroup || null,
            currentStatus: c.currentStatus ? (c.currentStatus as any) : null,
            villageTown: c.villageTown || null,
          },
        });
      }
    }
  }

  await prisma.memberDeletionRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED", decidedAt: new Date() },
  });

  revalidatePath("/admin/deletion-requests");
  revalidatePath("/dashboard/family");
  revalidatePath("/members");
  return { success: true };
}

export async function rejectDeletionRequest(requestId: string, reason?: string) {
  const admin = await requireSuperAdmin();
  if (!admin) return { error: "Not authorized" };

  const request = await prisma.memberDeletionRequest.findUnique({ where: { id: requestId } });
  if (!request) return { error: "Request not found" };
  if (request.status !== "PENDING") return { error: "This request has already been decided." };

  await prisma.memberDeletionRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED", rejectionReason: reason || null, decidedAt: new Date() },
  });

  revalidatePath("/admin/deletion-requests");
  revalidatePath("/dashboard/family");
  return { success: true };
}
