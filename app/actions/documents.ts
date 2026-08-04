"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { encrypt, decrypt } from "@/lib/crypto";

const BUCKET = "private-documents";

async function verifyOwner(memberId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const member = await prisma.familyMember.findFirst({
    where: { id: memberId, familyUnit: { familyHeadUserId: user.id } },
  });
  return member;
}

// Re-authenticate the logged-in family head with their ACCOUNT password
async function verifyAccountPassword(accountPassword: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser?.email) return false;
  const { error } = await supabase.auth.signInWithPassword({
    email: authUser.email,
    password: accountPassword,
  });
  return !error;
}

// Set or change a member's docs password — requires account-password verification
export async function setDocsPassword(
  memberId: string,
  newPassword: string,
  accountPassword: string
) {
  const member = await verifyOwner(memberId);
  if (!member) return { error: "Not authorized" };
  if (newPassword.length < 4) return { error: "Password must be at least 4 characters" };

  const ok = await verifyAccountPassword(accountPassword);
  if (!ok) return { error: "Your account password is incorrect." };

  await prisma.familyMember.update({
    where: { id: memberId },
    data: { docsPasswordEnc: encrypt(newPassword) },
  });
  revalidatePath("/dashboard/family/documents");
  return { success: true };
}

// View the existing docs password — requires account-password verification
export async function viewDocsPassword(memberId: string, accountPassword: string) {
  const member = await verifyOwner(memberId);
  if (!member) return { error: "Not authorized" };
  if (!member.docsPasswordEnc) return { error: "No password set yet." };

  const ok = await verifyAccountPassword(accountPassword);
  if (!ok) return { error: "Your account password is incorrect." };

  return { success: true, password: decrypt(member.docsPasswordEnc) };
}

export async function setDocsShared(memberId: string, shared: boolean) {
  const member = await verifyOwner(memberId);
  if (!member) return { error: "Not authorized" };
  await prisma.familyMember.update({
    where: { id: memberId },
    data: { docsSharedWhenLoggedIn: shared },
  });
  revalidatePath("/dashboard/family/documents");
  return { success: true };
}

export async function uploadDocument(memberId: string, formData: FormData) {
  const member = await verifyOwner(memberId);
  if (!member) return { error: "Not authorized" };
  if (!member.docsPasswordEnc) {
    return { error: "Set a password first before uploading documents." };
  }

  const file = formData.get("file") as File | null;
  const docType = ((formData.get("docType") as string) || "Document").trim();

  if (!file || file.size === 0) return { error: "Please choose a file" };
  if (file.size > 5 * 1024 * 1024) return { error: "File must be under 5MB" };

  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return { error: "Only JPG, PNG, or PDF files are allowed" };
  }

  const supabase = await createClient();
  const ext = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
  const path = `${memberId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: "Upload failed: " + uploadError.message };

  await prisma.privateDocument.create({
    data: { familyMemberId: memberId, docType, fileName: file.name, filePath: path },
  });

  revalidatePath("/dashboard/family/documents");
  return { success: true };
}

export async function deleteDocument(documentId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const doc = await prisma.privateDocument.findFirst({
    where: {
      id: documentId,
      familyMember: { familyUnit: { familyHeadUserId: user.id } },
    },
  });
  if (!doc) return { error: "Not authorized" };

  const supabase = await createClient();
  await supabase.storage.from(BUCKET).remove([doc.filePath]);
  await prisma.privateDocument.delete({ where: { id: documentId } });

  revalidatePath("/dashboard/family/documents");
  return { success: true };
}

// Unlock documents for viewing (uses the DOCUMENT password, not account password)
export async function unlockDocuments(memberId: string, password: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Please log in" };

  const member = await prisma.familyMember.findUnique({
    where: { id: memberId },
    include: { familyUnit: true, privateDocuments: true },
  });
  if (!member) return { error: "Not found" };

  const isOwner = member.familyUnit.familyHeadUserId === user.id;
  if (!isOwner && !member.docsSharedWhenLoggedIn) {
    return { error: "These documents are not shared." };
  }
  if (!member.docsPasswordEnc) {
    return { error: "No password set for these documents yet." };
  }

  const actual = decrypt(member.docsPasswordEnc);
  if (password !== actual) return { error: "Incorrect password." };

  const supabase = await createClient();
  const docs = await Promise.all(
    member.privateDocuments.map(async (d) => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(d.filePath, 300);
      return { id: d.id, docType: d.docType, fileName: d.fileName, url: data?.signedUrl || null };
    })
  );

  return { success: true, documents: docs };
}
