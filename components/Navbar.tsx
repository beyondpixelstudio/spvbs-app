import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const dbUser = await getCurrentUser();

  let navUser = null;
  if (dbUser) {
    // Get the display name from Supabase auth metadata
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const name =
      (user?.user_metadata?.full_name as string) ||
      dbUser.email ||
      "Member";

    navUser = { name, role: dbUser.role };
  }

  return <NavbarClient user={navUser} />;
}
