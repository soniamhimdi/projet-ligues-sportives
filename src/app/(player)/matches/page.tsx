import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

interface PageProps {
  searchParams: Promise<{
    type?: string;
  }>;
}

export default async function PlayerMatchesPage({
  searchParams,
}: PageProps) {
  const { userId } =
    await auth();

  if (!userId)
    redirect("/sign-in");

  const user =
    await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

  if (!user)
    redirect("/sign-in");

  const { type } =
    await searchParams;

  const now = new Date();

  const matches =
    await prisma.match.findMany({
      where: {
        OR: [
          {
            teamA: {
              members: {
                some: {
                  id: user.id,
                },
              },
            },
          },

          {
            teamB: {
              members: {
                some: {
                  id: user.id,
                },
              },
            },
          },
        ],

        ...(type ===
          "upcoming" && {
          date: {
            gte: now,
          },
        }),

        ...(type ===
          "past" && {
          date: {
            lt: now,
          },
        }),
      },

      include: {
  teamA: {
    include: {
      members: true,
    },
  },

  teamB: {
    include: {
      members: true,
    },
  },
},

      orderBy: {
        date: "asc",
      },
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Mes matchs
        </h1>

        <p className="text-muted-foreground">
          Matchs de vos équipes
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <a
          href="/matches"
          className="border px-4 py-2 rounded-lg"
        >
          Tous
        </a>

        <a
          href="/matches?type=upcoming"
          className="border px-4 py-2 rounded-lg"
        >
          À venir
        </a>

        <a
          href="/matches?type=past"
          className="border px-4 py-2 rounded-lg"
        >
          Passés
        </a>
      </div>

      {/* Matches */}
      {matches.length === 0 ? (
        <p>
          Aucun match
        </p>
      ) : (
        <div className="grid gap-4">
          {matches.map(
            (match) => {
              const isInTeamA =
  match.teamA.members.some(
    (member) =>
      member.id === user.id
  );

const opponent =
  isInTeamA
    ? match.teamB
    : match.teamA;

              return (
                <div
                  key={match.id}
                  className="border rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {
                        match.teamA
                          .name
                      }
                      {" vs "}
                      {
                        match.teamB
                          .name
                      }
                    </h2>

                    <span className="text-sm text-muted-foreground">
                      {new Date(
                        match.date
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <p>
                    Adversaire :
                    {" "}
                    {
                      opponent.name
                    }
                  </p>

                  <p>
                    Lieu :
                    {" "}
                    {
                      match.location
                    }
                  </p>

                  <div className="text-2xl font-bold">
                    {match.scoreA ??
                      "-"}
                    {" : "}
                    {match.scoreB ??
                      "-"}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}