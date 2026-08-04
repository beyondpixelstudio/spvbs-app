import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  // Only admins allowed — family heads/members get sent to their dashboard
  if (user.role !== "SUPER_ADMIN" && user.role !== "TALUKA_ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-[1280px] mx-auto px-[20px] py-[40px] flex flex-col md:flex-row gap-[30px]">
      <AdminSidebar role={user.role} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
