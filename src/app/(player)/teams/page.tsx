import prisma from "../../../lib/prisma";

interface PageProps {
  searchParams: Promise<{
    city?: string;

    sport?: string;

    available?: string;
  }>;
}

export default async function TeamsPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const city =
    params.city || "";

  const sport =
    params.sport || "";

  const available =
    params.available === "true";

  const teams =
    await prisma.team.findMany({
      where: {
        tournament: {
          city: city
            ? {
                contains:
                  city,
                mode:
                  "insensitive",
              }
            : undefined,

          sport: sport
            ? {
                contains:
                  sport,
                mode:
                  "insensitive",
              }
            : undefined,
        },
      },

      include: {
        tournament: true,

        _count: {
          select: {
            members: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const filteredTeams =
    available
      ? teams.filter(
          (team) =>
            team._count
              .members <
            team.maxCapacity
        )
      : teams;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Équipes disponibles
        </h1>

        <p className="text-muted-foreground">
          Rechercher une équipe
        </p>
      </div>

      {/* Filters */}
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="city"
          placeholder="Ville"
          defaultValue={city}
          className="border rounded-lg p-2"
        />

        <input
          type="text"
          name="sport"
          placeholder="Sport"
          defaultValue={sport}
          className="border rounded-lg p-2"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="available"
            value="true"
            defaultChecked={
              available
            }
          />

          Places disponibles
        </label>

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Rechercher
        </button>
      </form>

      {/* Teams */}
      <div className="grid gap-4">
        {filteredTeams.map(
          (team) => (
            <div
              key={team.id}
              className="border rounded-xl p-4 space-y-2"
            >
              <h2 className="text-xl font-semibold">
                {team.name}
              </h2>

              <p>
                Sport :{" "}
                {
                  team
                    .tournament
                    .sport
                }
              </p>

              <p>
                Ville :{" "}
                {
                  team
                    .tournament
                    .city
                }
              </p>

              <p>
                Places :{" "}
                {
                  team._count
                    .members
                }
                /
                {
                  team.maxCapacity
                }
              </p>

              <p>
                Tournoi :{" "}
                {
                  team
                    .tournament
                    .name
                }
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}