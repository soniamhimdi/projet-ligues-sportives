import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AcceptRejectButtons from "@/components/join-requests/AcceptRejectButtons";

export default async function OrganizerRequestsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  // get all pending requests for teams in tournaments owned by this organizer
  const requests = await prisma.joinRequest.findMany({
    where: {
      status: "PENDING",
      team: {
        tournament: { organizerId: user.id },
      },
    },
    include: {
      team: { include: { tournament: true } },
      player: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Demandes reçues</h1>
        <p className="text-muted-foreground">
          Demandes en attente pour vos équipes
        </p>
      </div>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">Aucune demande en attente.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {req.player.firstName ?? req.player.email}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {new Date(req.createdAt).toLocaleDateString("fr-CA")}
                </span>
              </div>

              <p>Équipe : {req.team.name}</p>
              <p>Tournoi : {req.team.tournament.name}</p>

              {req.message && (
                <p className="text-sm text-muted-foreground italic">
                  « {req.message} »
                </p>
              )}

              <AcceptRejectButtons requestId={req.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
