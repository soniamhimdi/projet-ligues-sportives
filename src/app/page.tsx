import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full mb-6">
            ✦ Plateforme communautaire
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            Trouve ton équipe.<br />
            Crée ton tournoi.
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto">
            Connecte organisateurs et joueurs passionnés dans ta région.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
              >
                Mon tableau de bord
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/teams"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Voir les équipes
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "124", label: "Tournois actifs" },
              { value: "830", label: "Équipes inscrites" },
              { value: "3 200", label: "Joueurs" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center"
              >
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {s.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-8">
            Ce que tu peux faire
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🔍",
                title: "Trouver une équipe",
                desc: "Filtre par ville, sport et niveau pour rejoindre une équipe près de chez toi.",
              },
              {
                icon: "🏆",
                title: "Créer un tournoi",
                desc: "Organise des compétitions locales et gère tes équipes en quelques clics.",
              },
              {
                icon: "📅",
                title: "Suivre tes matchs",
                desc: "Consulte le calendrier et les scores de toutes tes rencontres.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-lg mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        {!userId && (
          <section className="max-w-6xl mx-auto px-4 pb-24">
            <div className="bg-purple-700 rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Prêt à jouer ?
              </h2>
              <p className="text-purple-200 mb-8">
                Inscris-toi gratuitement et rejoins la communauté.
              </p>
              <Link
                href="/sign-up"
                className="inline-block px-8 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
              >
                Commencer maintenant
              </Link>
            </div>
          </section>
        )}

      </main>
    </>
  );
}