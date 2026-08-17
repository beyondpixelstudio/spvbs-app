"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "profile-pictures";
const MAX_SIZE = 200 * 1024; // 200KB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadProfilePicture(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Please log in." };

    const file = formData.get("photo") as File | null;
    if (!file || file.size === 0) return { error: "Please choose an image." };
    if (file.size > MAX_SIZE) return { error: "Image must be under 200KB." };
    if (!ALLOWED_TYPES.includes(file.type)) return { error: "Only JPG, PNG, or WebP images are allowed." };

    const supabase = await createClient();

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    // Remove any previous picture for this user first (keep storage clean)
    const { data: existing } = await supabase.storage.from(BUCKET).list(user.id);
    if (existing && existing.length > 0) {
      const { error: removeError } = await supabase.storage.from(BUCKET).remove(existing.map((f) => `${user.id}/${f.name}`));
      if (removeError) console.error("Failed to remove old profile pictures:", removeError.message);
    }

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: true,
    });
    if (uploadError) return { error: `Upload failed: ${uploadError.message}` };

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    await prisma.user.update({
      where: { id: user.id },
      data: { profilePictureUrl: publicUrl },
    });

    revalidatePath("/dashboard");
    revalidatePath("/members");
    return { success: true, url: publicUrl };
  } catch (e: any) {
    return { error: e?.message || "Something went wrong." };
  }
}

export async function removeProfilePicture() {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Please log in." };

    const supabase = await createClient();
    const { data: existing } = await supabase.storage.from(BUCKET).list(user.id);
    if (existing && existing.length > 0) {
      await supabase.storage.from(BUCKET).remove(existing.map((f) => `${user.id}/${f.name}`));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { profilePictureUrl: null },
    });

    revalidatePath("/dashboard");
    revalidatePath("/members");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Something went wrong." };
  }
}
