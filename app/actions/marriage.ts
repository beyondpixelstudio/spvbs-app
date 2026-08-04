"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "marriage-documents";

// Helper: upload one file, return its storage path
async function uploadFile(supabase: any, prefix: string, file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error(`${prefix}: image must be under 5MB`);
  if (!["image/jpeg", "image/png"].includes(file.type)) throw new Error(`${prefix}: only JPG/PNG allowed`);
  const ext = file.type === "image/png" ? "png" : "jpg";
  const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return path;
}

export async function submitMarriagePermission(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: "Please log in to submit." };

    const supabase = await createClient();

    // Text fields
    const get = (k: string) => (formData.get(k) as string)?.trim() || null;

    const groomName = get("groomName");
    const brideName = get("brideName");
    if (!groomName || !brideName) return { error: "Groom and bride names are required." };

    // STRICT: submitter must be a family head, and at least one side must be their own
    // UNMARRIED son (groom) or daughter (bride). The other side must be a real member
    // of some family. This prevents bypassing the UI restrictions.
    const myFamily = await prisma.familyUnit.findUnique({
      where: { familyHeadUserId: user.id },
      include: { members: true },
    });
    if (!myFamily) return { error: "Only a family head with a registered family can submit." };

    const norm = (s: string) => s.trim().toLowerCase();

    // Age helper: returns years, or null if no DOB
    const ageOf = (dob: Date | null) =>
      dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000)) : null;
    const isUnder18 = (dob: Date | null) => {
      const a = ageOf(dob);
      return a !== null && a < 18;
    };

    // Son/Grandson count as groom-eligible; Daughter/Granddaughter as bride-eligible
    const mySons = myFamily.members.filter((m) => ["Son", "Grandson"].includes(m.relation));
    const myDaughters = myFamily.members.filter((m) => ["Daughter", "Granddaughter"].includes(m.relation));

    const myGroom = mySons.find((m) => norm(m.fullName) === norm(groomName));
    const myBride = myDaughters.find((m) => norm(m.fullName) === norm(brideName));
    const groomIsMySon = !!myGroom;
    const brideIsMyDaughter = !!myBride;

    if (!groomIsMySon && !brideIsMyDaughter) {
      return { error: "You can only apply for your own son (groom) or daughter (bride). One side must be your own child." };
    }

    // Age 18+ enforcement for the side that is our own member
    if (myGroom && isUnder18(myGroom.dob)) return { error: "The groom is under 18 and cannot be part of a marriage application." };
    if (myBride && isUnder18(myBride.dob)) return { error: "The bride is under 18 and cannot be part of a marriage application." };

    // Verify the OTHER side exists as a real member (no free-text) and is 18+
    if (groomIsMySon) {
      const brideMember = await prisma.familyMember.findFirst({
        where: { relation: { in: ["Daughter", "Granddaughter"] }, fullName: { equals: brideName, mode: "insensitive" } },
      });
      if (!brideMember) return { error: "The bride must be added as a member by her family first." };
      if (isUnder18(brideMember.dob)) return { error: "The bride is under 18 and cannot be part of a marriage application." };
    } else {
      const groomMember = await prisma.familyMember.findFirst({
        where: { relation: { in: ["Son", "Grandson"] }, fullName: { equals: groomName, mode: "insensitive" } },
      });
      if (!groomMember) return { error: "The groom must be added as a member by his family first." };
      if (isUnder18(groomMember.dob)) return { error: "The groom is under 18 and cannot be part of a marriage application." };
    }

    // Required photos
    const groomPhoto = formData.get("groomPhoto") as File | null;
    const bridePhoto = formData.get("bridePhoto") as File | null;
    if (!groomPhoto || groomPhoto.size === 0) return { error: "Groom photo is required." };
    if (!bridePhoto || bridePhoto.size === 0) return { error: "Bride photo is required." };

    const groomId = `groom-${Date.now()}`;
    const groomPhotoPath = await uploadFile(supabase, groomId, groomPhoto);
    const bridePhotoPath = await uploadFile(supabase, `bride-${Date.now()}`, bridePhoto);

    // Witnesses (3 per side) — each has a name + signature image (required)
    async function collectWitnesses(side: string) {
      const arr = [];
      for (let i = 1; i <= 3; i++) {
        const name = (formData.get(`${side}Witness${i}Name`) as string)?.trim();
        const sig = formData.get(`${side}Witness${i}Sig`) as File | null;
        if (!name) throw new Error(`${side} witness ${i} name is required.`);
        if (!sig || sig.size === 0) throw new Error(`${side} witness ${i} signature is required.`);
        const sigPath = await uploadFile(supabase, `${side}-wit${i}-${Date.now()}`, sig);
        arr.push({ name, signaturePath: sigPath });
      }
      return arr;
    }

    const groomWitnesses = await collectWitnesses("groom");
    const brideWitnesses = await collectWitnesses("bride");

    await prisma.marriagePermission.create({
      data: {
        submittedByUserId: user.id,
        groomName,
        groomFather: get("groomFather"),
        groomAge: get("groomAge"),
        groomEducation: get("groomEducation"),
        groomVillage: get("groomVillage"),
        groomPosa: get("groomPosa"),
        groomBhaya: get("groomBhaya"),
        groomDistrict: get("groomDistrict"),
        groomPhone: get("groomPhone"),
        groomPhotoPath,
        brideName,
        brideFather: get("brideFather"),
        brideAge: get("brideAge"),
        brideEducation: get("brideEducation"),
        brideVillage: get("brideVillage"),
        bridePosa: get("bridePosa"),
        brideBhaya: get("brideBhaya"),
        brideDistrict: get("brideDistrict"),
        bridePhone: get("bridePhone"),
        bridePhotoPath,
        marriageDate: get("marriageDate"),
        taluka: get("taluka"),
        declaration: get("declaration"),
        groomWitnesses,
        brideWitnesses,
        status: "PENDING",
      },
    });

    revalidatePath("/permission/marriage");
    revalidatePath("/admin/marriage");
    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Something went wrong." };
  }
}
