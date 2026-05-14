import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AcceptRejectButtons from "@/components/join-requests/AcceptRejectButtons";

export default async function OrganizerRequestsPage() {
  const user = await requireAuth();

  // get all pending requests for teams in tournaments owned by this organizer
  const teams =
  await prisma.team.findMany({
    where: {
      tournament: {
        organizerId: user.id,
      },
    },
  });
  const requests = await prisma.joinRequest.findMany({
   where: {
  status: "PENDING",

  teamId:
    teamId || undefined,

  team: {
    tournament: {
      organizerId: user.id,
    },
  },
},
    include: {
      team: { include: { tournament: true } },
      player: {
  include: {
    playerProfile: true,
  },
},
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
  <div>
    <h1 className="text-3xl font-bold">
      Demandes reçues
    </h1>

    <p className="text-muted-foreground">
      Demandes en attente pour vos équipes
    </p>
  </div>

  {/* FILTER */}
  <form>
    <select
      name="teamId"
      defaultValue={teamId}
      className="border rounded-lg p-2"
    >
      <option value="">
        Toutes les équipes
      </option>

      {teams.map((team) => (
        <option
          key={team.id}
          value={team.id}
        >
          {team.name}
        </option>
      ))}
    </select>

    <button className="ml-2 border px-4 py-2 rounded-lg">
      Filtrer
    </button>
  </form>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">Aucune demande en attente.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {req.player.fullName ?? req.player.email}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {new Date(req.createdAt).toLocaleDateString("fr-CA")}
                </span>
              </div>

          <p>
            Équipe :
            {" "}
            {req.team.name}
          </p>

          <p>
            Tournoi :
            {" "}
            {
              req.team
                .tournament.name
            }
          </p>

          <p>
            Ville :
            {" "}
            {req.player
              .playerProfile
              ?.city || "N/A"}
          </p>

          <p>
            Niveau :
            {" "}
            {req.player
              .playerProfile
              ?.level || "N/A"}
          </p>

          <p>
            Sport :
            {" "}
            {req.player
              .playerProfile
              ?.favoriteSport ||
              "N/A"}
          </p>

          {req.message && (
            <p className="text-sm text-muted-foreground italic">
              « {req.message} »
            </p>
          )}

          <AcceptRejectButtons
            requestId={req.id}
          />
        </div>
      ))}
    </div>
  )}
</div>
  );
}
