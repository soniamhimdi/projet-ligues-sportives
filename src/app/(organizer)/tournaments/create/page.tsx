import TournamentForm from "../../../../components/tournaments/TournamentForm";

export default function CreateTournamentPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Créer un tournoi
        </h1>

        <p className="text-muted-foreground">
          Ajouter un nouveau tournoi sportif
        </p>
      </div>

      <TournamentForm />
    </div>
  );
}