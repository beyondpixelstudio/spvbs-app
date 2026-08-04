import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role === "SUPER_ADMIN" || user.role === "TALUKA_ADMIN") {
    redirect("/admin");
  }

  // Is this user in any committee? (shows the Committee Tasks link)
  const committeeCount = await prisma.committeeAssignment.count({
    where: { userId: user.id },
  });
  const isCommitteeMember = committeeCount > 0;

  return (
    <div className="max-w-[1200px] mx-auto px-[20px] py-[40px] flex flex-col md:flex-row gap-[30px]">
      <DashboardSidebar isCommitteeMember={isCommitteeMember} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
