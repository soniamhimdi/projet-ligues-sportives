"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Header({ role }: { role?: string | null }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Nom du site */}
        <Link
          href="/"
          className="text-xl font-bold text-purple-700 dark:text-purple-400 hover:opacity-80 transition-opacity"
        >
          Ligues Sportives Communautaires
        </Link>

        {/* Navigation centrale */}
        <nav
          style={{ display: "flex", gap: "24px" }}
          className="hidden md:flex items-center text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          <Link
            href="/"
            className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
          >
            Accueil
          </Link>
          <Show when="signed-in">
            <Link
              href="/teams"
              className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
            >
              Équipes
            </Link>
            <Link
              href="/tournaments"
              className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
            >
              Tournois
            </Link>
            {(role === "PLAYER" || role === "ADMIN") && (
              <Link
                href="/my-requests"
                className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
              >
                Mes demandes
              </Link>
            )}
          </Show>
        </nav>

        {/* Partie droite : auth */}
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton>
              <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors px-3 py-1.5">
                Connexion
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="text-sm font-medium bg-purple-700 text-white rounded-full px-4 py-1.5 hover:bg-purple-800 transition-colors">
                Inscription
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            {/* Nom de l'utilisateur */}
            {isLoaded && user && (
              <span className="hidden md:block text-sm text-gray-600 dark:text-gray-400">
                Bonjour,{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.firstName ?? user.fullName ?? "Utilisateur"}
                </span>
              </span>
            )}

            {/* Avatar + menu Clerk */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                },
              }}
            />

            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="text-sm font-medium text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1.5"
            >
              Déconnexion
            </button>
          </Show>
        </div>
      </div>
    </header>
  );
}
