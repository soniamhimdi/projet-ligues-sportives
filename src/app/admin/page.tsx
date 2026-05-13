// src/app/admin/page.tsx
import { requireRole } from "@/lib/auth";
import  prisma  from "@/lib/prisma";

export default async function AdminPage() {
  await requireRole("ADMIN");

  const tournaments = await prisma.tournament.findMany({
    include: {
      organizer: { select: { fullName: true, email: true } },
      teams: {
        include: {
          members: { select: { id: true, fullName: true } },
          _count: { select: { joinRequests: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>
      <p className="text-gray-500">
        {tournaments.length} tournoi(s) enregistré(s)
      </p>
    </div>
  );
}