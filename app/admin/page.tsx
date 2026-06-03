import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const user = await currentUser();

  // Nëse përdoruesi nuk është i identifikuar (logguar)
  if (!user) {
    redirect("/");
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses[0]?.emailAddress;

  console.log("AdminPage access check:", { adminEmail, userEmail });

  // Nëse nuk ka email admin të konfiguruar ose emaili i përdoruesit nuk përputhet me ADMIN_EMAIL
  if (!adminEmail || userEmail !== adminEmail) {
    console.log("Qasja u refuzua. Ridrejtimi te '/'");
    redirect("/");
  }

  return <AdminDashboardClient />;
}