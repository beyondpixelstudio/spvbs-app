"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

// Full server-side membership signup: creates the auth account (auto-confirmed)
// AND saves all details in one go. Avoids client-side session timing issues.
const MAX_PHOTO_SIZE = 200 * 1024; // 200KB
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function submitMembership(input: {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  qualification: string;
  occupation: string;
  currentStatus: string;
  bloodGroup: string;
  mobile: string;
  taluka: string;
  villageTown: string;
  photo?: File | null;
}) {
  try {
    // Admin client (service role) — can create confirmed users
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Create the auth user (email auto-confirmed so they can log in right away)
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: input.email.trim(),
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.fullName.trim(), role: "FAMILY_HEAD" },
    });

    if (createError) {
      return { error: createError.message };
    }
    const authId = created.user?.id;
    if (!authId) return { error: "Could not create account." };

    // 2. Ensure the User row exists (the trigger may create it; upsert to be safe)
    await prisma.user.upsert({
      where: { id: authId },
      update: { email: input.email.trim() },
      create: {
        id: authId,
        email: input.email.trim(),
        role: "FAMILY_HEAD",
        status: "PENDING",
      },
    });

    // 2b. Optional profile picture upload (same rules as the dashboard uploader)
    if (input.photo && input.photo.size > 0) {
      if (input.photo.size > MAX_PHOTO_SIZE) {
        return { error: "Profile photo must be under 200KB." };
      }
      if (!ALLOWED_PHOTO_TYPES.includes(input.photo.type)) {
        return { error: "Profile photo must be JPG, PNG, or WebP." };
      }
      const ext = input.photo.type === "image/png" ? "png" : input.photo.type === "image/webp" ? "webp" : "jpg";
      const path = `${authId}/avatar-${Date.now()}.${ext}`;
      const { error: uploadError } = await admin.storage.from("profile-pictures").upload(path, input.photo, {
        contentType: input.photo.type,
        upsert: true,
      });
      if (!uploadError) {
        const { data: urlData } = admin.storage.from("profile-pictures").getPublicUrl(path);
        await prisma.user.update({
          where: { id: authId },
          data: { profilePictureUrl: urlData.publicUrl },
        });
      }
    }

    // 3. Create the family unit
    const familyUnit = await prisma.familyUnit.upsert({
      where: { familyHeadUserId: authId },
      update: {
        familyName: input.fullName.trim(),
        taluka: input.taluka.trim(),
        villageTown: input.villageTown.trim(),
      },
      create: {
        familyName: input.fullName.trim(),
        familyHeadUserId: authId,
        taluka: input.taluka.trim(),
        villageTown: input.villageTown.trim(),
      },
    });

    // 4. Create the Head member with all details
    const existingHead = await prisma.familyMember.findFirst({
      where: { familyUnitId: familyUnit.id, relation: "Head" },
    });
    const headData = {
      familyUnitId: familyUnit.id,
      relation: "Head",
      fullName: input.fullName.trim(),
      gender: input.gender ? (input.gender as any) : null,
      dob: input.dob ? new Date(input.dob) : null,
      maritalStatus: input.maritalStatus ? (input.maritalStatus as any) : null,
      qualification: input.qualification || null,
      occupation: input.occupation || null,
      currentStatus: input.currentStatus ? (input.currentStatus as any) : null,
      bloodGroup: input.bloodGroup || null,
      mobileNumber: input.mobile || null,
      villageTown: input.villageTown.trim() || null,
      visibility: "PUBLIC" as const,
    };
    if (existingHead) {
      await prisma.familyMember.update({ where: { id: existingHead.id }, data: headData });
    } else {
      await prisma.familyMember.create({ data: headData });
    }

    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Something went wrong. Please try again." };
  }
}
