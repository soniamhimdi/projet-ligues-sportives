
// src/app/(organizer)/tournaments/page.tsx
import { requireRole } from "@/lib/auth";

import prisma  from "../../../lib/prisma";

export default async function TournamentsPage() {
  await requireRole("ORGANIZER");
  // TEMPORAIRE
  const organizerId = "TEMP_USER_ID";
  

  const tournaments =
    await prisma.tournament.findMany({
      where: {
        organizerId,
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
          <h1 className="text-3xl font-bold">
            Mes tournois
          </h1>

          <p className="text-muted-foreground">
            Liste des tournois créés
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="border rounded-xl p-4"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                {tournament.name}
              </h2>

              <p>
                Sport : {tournament.sport}
              </p>

              <p>
                Ville : {tournament.city}
              </p>

              <p>
                Équipes :{" "}
                {tournament._count.teams}
              </p>

              <p>
                Prix :{" "}
                {tournament.entryFee / 100}{" "}
                {tournament.currency}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}