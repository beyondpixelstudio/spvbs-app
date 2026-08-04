"use server";

import { prisma } from "@/lib/prisma";

export async function sendContactMessage(input: {
  name: string;
  taluka: string;
  village: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    if (!input.name.trim()) return { error: "Please enter your name." };
    if (!input.taluka.trim()) return { error: "Please select your taluka." };
    if (!input.village.trim()) return { error: "Please enter your village." };
    if (!input.phone.trim()) return { error: "Please enter your phone number." };
    if (!input.subject.trim()) return { error: "Please enter your query / subject." };

    await prisma.contactMessage.create({
      data: {
        name: input.name.trim(),
        taluka: input.taluka.trim() || null,
        village: input.village.trim() || null,
        phone: input.phone.trim() || null,
        email: input.email.trim() || null,
        subject: input.subject.trim() || null,
        message: input.message.trim() || input.subject.trim(),
      },
    });

    return { success: true };
  } catch (e: any) {
    return { error: e?.message || "Something went wrong. Please try again." };
  }
}
