// src/app/admin/page.tsx
import { requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminRoleSelect from "@/components/admin/AdminRoleSelect";

const roleLabel: Record<string, string> = {
  PLAYER: "Joueur",
  ORGANIZER: "Organisateur",
  ADMIN: "Admin",
};

const roleBadge: Record<string, string> = {
  PLAYER: "bg-blue-100 text-blue-700",
  ORGANIZER: "bg-purple-100 text-purple-700",
  ADMIN: "bg-red-100 text-red-700",
};

export default async function AdminPage() {
  await requireRole("ADMIN");

  const [tournaments, users] = await Promise.all([
    prisma.tournament.findMany({
      include: {
        organizer: { select: { fullName: true, email: true } },
        teams: {
          include: {
            members: { select: { id: true, fullName: true } },
            _count: { select: { joinRequests: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { joinRequests: true, teams: true, tournaments: true } },
      },
    }),
  ]);

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">Administration</h1>

      {/* ===== GESTION DES UTILISATEURS ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Utilisateurs ({users.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-xl overflow-hidden">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Nom</th>
                <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 font-medium text-gray-600">Rôle actuel</th>
                <th className="px-4 py-3 font-medium text-gray-600">Activité</th>
                <th className="px-4 py-3 font-medium text-gray-600">Changer rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.fullName || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[user.role]}`}>
                      {roleLabel[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {user._count.tournaments} tournoi(s) · {user._count.teams} équipe(s) · {user._count.joinRequests} demande(s)
                  </td>
                  <td className="px-4 py-3">
                    <AdminRoleSelect userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== TOURNOIS ===== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tournois ({tournaments.length})</h2>
        <div className="grid gap-4">
          {tournaments.map((t) => (
            <div key={t.id} className="border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500">{t.sport} · {t.city} · par {t.organizer.fullName}</p>
                </div>
                <span className="text-sm text-gray-400">{t.teams.length} équipe(s)</span>
              </div>

              {t.teams.map((team) => (
                <div key={team.id} className="ml-4 border-l-2 border-gray-100 pl-4 space-y-1">
                  <p className="text-sm font-medium">{team.name} — {team.members.length}/{team._count.joinRequests + team.members.length} membres</p>
                  {team.members.length > 0 && (
                    <ul className="text-xs text-gray-500 list-disc ml-4">
                      {team.members.map((m) => (
                        <li key={m.id}>{m.fullName}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}