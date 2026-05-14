import { notFound } from "next/navigation";

import prisma from "@/lib/prisma";

import { requireRole } from "@/lib/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminTournamentDetailsPage({
  params,
}: PageProps) {
  await requireRole("ADMIN");

  const { id } = await params;

  const tournament =
    await prisma.tournament.findUnique({
      where: {
        id,
      },

      include: {
        organizer: true,

        teams: {
          include: {
            members: true,

            joinRequests: true,

            _count: {
              select: {
                members: true,
                joinRequests: true,
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
    notFound();
  }

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {tournament.name}
        </h1>

        <p className="text-gray-500">
          {tournament.sport}
          {" · "}
          {tournament.city}
        </p>

        <p className="text-sm text-gray-400">
          Organisateur :
          {" "}
          {
            tournament.organizer
              .fullName
          }
          {" ("}
          {
            tournament.organizer
              .email
          }
          {")"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Nombre d’équipes
          </p>

          <p className="text-3xl font-bold">
            {
              tournament._count
                .teams
            }
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Prix d’entrée
          </p>

          <p className="text-3xl font-bold">
            {tournament.entryFee / 100}
            {" "}
            {
              tournament.currency
            }
          </p>
        </div>

        <div className="border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Date
          </p>

          <p className="text-lg font-semibold">
            {new Date(
              tournament.startDate
            ).toLocaleDateString(
              "fr-CA"
            )}
          </p>
        </div>
      </div>

      {/* TEAMS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Équipes
        </h2>

        {tournament.teams.length ===
        0 ? (
          <p className="text-gray-500">
            Aucune équipe
          </p>
        ) : (
          <div className="grid gap-4">
            {tournament.teams.map(
              (team) => (
                <div
                  key={team.id}
                  className="border rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {team.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {
                          team._count
                            .members
                        }
                        {" / "}
                        {
                          team.maxCapacity
                        }
                        {" joueurs"}
                      </p>
                    </div>

                    <div className="text-sm text-gray-400">
                      {
                        team._count
                          .joinRequests
                      }
                      {" demande(s)"}
                    </div>
                  </div>

                  {/* MEMBERS */}
                  {team.members.length >
                    0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        Membres
                      </h4>

                      <div className="grid gap-2">
                        {team.members.map(
                          (
                            member
                          ) => (
                            <div
                              key={
                                member.id
                              }
                              className="bg-gray-50 rounded-lg p-2 text-sm"
                            >
                              {
                                member.fullName
                              }
                              {" · "}
                              {
                                member.email
                              }
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}