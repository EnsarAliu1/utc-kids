import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncClerkUserToDB } from "@/lib/actions/user-sync.action";
import AdminDashboardClient from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const user = await currentUser();

  if (!user) redirect("/login");

  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses[0]?.emailAddress;

  if (!adminEmail || userEmail !== adminEmail) redirect("/");

  // Sinkronizon përdoruesin Clerk me databazën Neon (pa webhook)
  await syncClerkUserToDB();

  return <AdminDashboardClient />;
}