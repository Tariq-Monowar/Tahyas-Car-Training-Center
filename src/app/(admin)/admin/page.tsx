import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, COOKIE } from "@/lib/jwt";
import AdminDashboard from "./AdminDashboard";

export const metadata = { title: "Admin | তাহয়াস" };

export default async function AdminPage() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? "";
  if (!await verifyAdminToken(token)) redirect("/admin/login");
  return <AdminDashboard />;
}
