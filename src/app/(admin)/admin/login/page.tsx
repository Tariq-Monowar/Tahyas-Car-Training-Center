import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, COOKIE } from "@/lib/jwt";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login | তাহয়াস" };

export default async function AdminLoginPage() {
  // Already signed in (e.g. the installed app opened here) → straight to the dashboard.
  const jar = await cookies();
  if (await verifyAdminToken(jar.get(COOKIE)?.value ?? "")) redirect("/admin");
  return <LoginForm />;
}
