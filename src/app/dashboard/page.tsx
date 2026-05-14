import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import OnboardingForm from "@/components/OnboardingForm";

export default async function DashboardPage() {
  const user = await requireAuth();

  // Nouvel utilisateur → choix du rôle inline
  if (!user.onboarded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenue !</h1>
            <p className="text-gray-500 mt-1">
              Quel est votre rôle sur la plateforme ?
            </p>
          </div>
          <OnboardingForm currentRole="PLAYER" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {user.fullName} 👋
          </h1>
          <p className="text-gray-500 mt-1">Rôle : {user.role}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(user.role === "ORGANIZER" || user.role === "ADMIN") && (
            <>
              <Link
                href="/tournaments"
                className="block bg-white border rounded-xl p-6 hover:border-purple-400 transition-colors"
              >
                <p className="font-semibold text-gray-900">🏆 Mes tournois</p>
                <p className="text-sm text-gray-500 mt-1">
                  Créer et gérer vos tournois
                </p>
              </Link>
              <Link
                href="/requests"
                className="block bg-white border rounded-xl p-6 hover:border-purple-400 transition-colors"
              >
                <p className="font-semibold text-gray-900">📋 Demandes</p>
                <p className="text-sm text-gray-500 mt-1">
                  Gérer les demandes d&apos;inscription
                </p>
              </Link>
            </>
          )}

          {(user.role === "PLAYER" || user.role === "ADMIN") && (
            <>
              <Link
                href="/teams"
                className="block bg-white border rounded-xl p-6 hover:border-purple-400 transition-colors"
              >
                <p className="font-semibold text-gray-900">⚽ Équipes</p>
                <p className="text-sm text-gray-500 mt-1">
                  Parcourir et rejoindre une équipe
                </p>
              </Link>
              <Link
                href="/my-requests"
                className="block bg-white border rounded-xl p-6 hover:border-purple-400 transition-colors"
              >
                <p className="font-semibold text-gray-900">📨 Mes demandes</p>
                <p className="text-sm text-gray-500 mt-1">
                  Suivre vos demandes d&apos;inscription
                </p>
              </Link>
            </>
          )}

          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="block bg-white border rounded-xl p-6 hover:border-purple-400 transition-colors"
            >
              <p className="font-semibold text-gray-900">⚙️ Administration</p>
              <p className="text-sm text-gray-500 mt-1">
                Gérer les utilisateurs et rôles
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
