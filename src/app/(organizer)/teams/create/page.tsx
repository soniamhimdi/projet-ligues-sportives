import prisma from "../../../../lib/prisma";

import TeamForm from "../../../../components/teams/TeamForm";

export default async function CreateTeamPage() {
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
    });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Créer une équipe
        </h1>

        <p className="text-muted-foreground">
          Ajouter une équipe dans
          un tournoi
        </p>
      </div>

      <TeamForm
        tournaments={tournaments}
      />
    </div>
  );
}