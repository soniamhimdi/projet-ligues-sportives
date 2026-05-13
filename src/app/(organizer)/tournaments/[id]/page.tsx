import prisma from "../../../../lib/prisma";

import Link from "next/link";

import { deleteTournament } from "../../../../server/actions/tournaments";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TournamentDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const tournament =
    await prisma.tournament.findUnique({
      where: {
        id,
      },

      include: {
        teams: {
          include: {
            _count: {
              select: {
                members: true,
              },
            },
          },
        },

        _count: {
          select: {
            teams: true,
          },
        },
      },
    });

  if (!tournament) {
    return (
      <div className="p-6">
        Tournoi introuvable
      </div>
    );
  }

  const totalPlayers =
    tournament.teams.reduce(
      (acc, team) =>
        acc + team._count.members,
      0
    );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {tournament.name}
        </h1>

        <p>
          Sport : {tournament.sport}
        </p>

        <p>
          Ville : {tournament.city}
        </p>

        <p>
          Date :{" "}
          {new Date(
            tournament.startDate
          ).toLocaleDateString()}
        </p>

        <p>
          Prix :{" "}
          {tournament.entryFee / 100}{" "}
          {tournament.currency}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold">
            Nombre déquipes
          </h2>

          <p className="text-2xl font-bold">
            {tournament._count.teams}
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <h2 className="font-semibold">
            Joueurs inscrits
          </h2>

          <p className="text-2xl font-bold">
            {totalPlayers}
          </p>
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Équipes
        </h2>

        {tournament.teams.length ===
        0 ? (
          <p>
            Aucune équipe pour le
            moment
          </p>
        ) : (
          <div className="grid gap-4">
            {tournament.teams.map(
              (team) => (
                <div
                  key={team.id}
                  className="border rounded-xl p-4"
                >
                  <h3 className="text-xl font-semibold">
                    {team.name}
                  </h3>

                  <p>
                    Joueurs :{" "}
                    {
                      team._count
                        .members
                    }
                    /
                    {
                      team.maxCapacity
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6">
        <Link
          href={`/tournaments/${tournament.id}/edit`}
        >
          <button className="bg-black text-white px-4 py-2 rounded-lg">
            Modifier le tournoi
          </button>
        </Link>

        <form
          action={async () => {
            "use server";

            await deleteTournament(
              tournament.id
            );
          }}
        >
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
            Supprimer le tournoi
          </button>
        </form>
      </div>
    </div>
  );
}