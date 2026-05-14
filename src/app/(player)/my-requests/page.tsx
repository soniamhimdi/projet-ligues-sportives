import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CancelRequestButton from "@/components/join-requests/CancelRequestButton";
import { CheckoutButton } from "@/app/cart/_components/CheckoutButton";

export default async function MyRequestsPage() {
  const user = await requireAuth();

  const requests = await prisma.joinRequest.findMany({
    where: { playerId: user.id },
    include: {
      team: {
        include: { tournament: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusLabel: Record<string, string> = {
    PENDING: "En attente",
    ACCEPTED: "Acceptée",
    REJECTED: "Refusée",
  };

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes demandes</h1>
        <p className="text-muted-foreground">
          Demandes pour rejoindre une équipe
        </p>
      </div>

      {requests.length === 0 ? (
        <p className="text-muted-foreground">Aucune demande envoyée.</p>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{req.team.name}</h2>
                <span
                  className={`text-sm px-2 py-1 rounded-full font-medium ${statusColor[req.status]}`}
                >
                  {statusLabel[req.status] ?? req.status}
                </span>
              </div>

              <p>Tournoi : {req.team.tournament.name}</p>
              <p>Sport : {req.team.tournament.sport}</p>
              <p>Ville : {req.team.tournament.city}</p>

              {req.message && (
                <p className="text-sm text-muted-foreground italic">
                  « {req.message} »
                </p>
              )}

              {req.status === "PENDING" && (
                <CancelRequestButton requestId={req.id} />
              )}

              {req.paymentStatus === "PENDING" && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ Paiement requis pour finaliser votre inscription
                  </p>
                  <CheckoutButton joinRequestId={req.id} />
                </div>
              )}

              {req.paymentStatus === "PAID" && (
                <p className="text-sm text-green-700 font-medium">
                  ✅ Paiement confirmé
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
