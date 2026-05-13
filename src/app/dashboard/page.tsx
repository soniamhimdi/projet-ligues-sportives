import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await requireAuth();

  // Redirige selon le rôle
  if (user.role === "ORGANIZER") {
    redirect("/tournaments");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  // PLAYER → son espace
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bonjour, {user.fullName} 👋</h1>
      <p className="text-gray-500 mt-2">Rôle : {user.role}</p>
    </div>
  );
}