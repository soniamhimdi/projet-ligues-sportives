import prisma from "../../../../../lib/prisma";

import TournamentForm from "../../../../../components/tournaments/TournamentForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTournamentPage({
  params,
}: PageProps) {
  const { id } = await params;

  const tournament =
    await prisma.tournament.findUnique({
      where: {
        id,
      },
    });

  if (!tournament) {
    return (
      <div className="p-6">
        Tournoi introuvable
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Modifier le tournoi
        </h1>

        <p className="text-muted-foreground">
          Modifier les informations
          du tournoi
        </p>
      </div>

      <TournamentForm
        tournament={tournament}
        isEdit
      />
    </div>
  );
}