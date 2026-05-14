import Link from "next/link";
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function TournamentsPage() {
  const user = await requireRole("ORGANIZER");

  const tournaments = await prisma.tournament.findMany({
    where: {
      organizerId: user.id,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      _count: {
        select: {
          teams: true,
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes tournois</h1>

          <p className="text-muted-foreground">Liste des tournois créés</p>
        </div>

        <Link
          href="/tournaments/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Créer un tournoi
        </Link>
      </div>

      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="border rounded-xl p-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{tournament.name}</h2>

              <p>Sport : {tournament.sport}</p>

              <p>Ville : {tournament.city}</p>

              <p>Équipes : {tournament._count.teams}</p>

              <p>
                Prix : {tournament.entryFee / 100} {tournament.currency}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
