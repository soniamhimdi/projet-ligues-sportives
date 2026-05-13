import prisma from "../../../../lib/prisma";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeamDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const team =
    await prisma.team.findUnique({
      where: {
        id,
      },

      include: {
        tournament: true,

        members: {
          include: {
            playerProfile: true,
          },
        },

        _count: {
          select: {
            members: true,
          },
        },
      },
    });

  if (!team) {
    return (
      <div className="p-6">
        Équipe introuvable
      </div>
    );
  }

  const availableSpots =
    team.maxCapacity -
    team._count.members;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {team.name}
        </h1>

        <p>
          Sport :{" "}
          {
            team.tournament
              .sport
          }
        </p>

        <p>
          Tournoi :{" "}
          {
            team.tournament
              .name
          }
        </p>

        <p>
          Ville :{" "}
          {
            team.tournament
              .city
          }
        </p>

        <p>
          Places disponibles :{" "}
          {
            availableSpots
          }{" "}
          / {team.maxCapacity}
        </p>
      </div>

      {/* Members */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Membres actuels
        </h2>

        {team.members.length ===
        0 ? (
          <p>
            Aucun joueur dans
            cette équipe
          </p>
        ) : (
          <div className="grid gap-4">
            {team.members.map(
              (member) => (
                <div
                  key={
                    member.id
                  }
                  className="border rounded-xl p-4"
                >
                  <h3 className="font-semibold">
                    {
                      member.fullName
                    }
                  </h3>

                  <p>
                    Niveau :{" "}
                    {member
                      .playerProfile
                      ?.level ||
                      "N/A"}
                  </p>

                  <p>
                    Sport :{" "}
                    {member
                      .playerProfile
                      ?.favoriteSport ||
                      "N/A"}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}