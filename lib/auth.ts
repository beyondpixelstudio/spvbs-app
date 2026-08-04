import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Returns the logged-in user's DB record (with role & status), or null.
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return dbUser;
}
