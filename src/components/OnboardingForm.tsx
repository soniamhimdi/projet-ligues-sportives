"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setOwnRole } from "@/server/actions/users";

const roles = [
  {
    value: "PLAYER",
    label: "Joueur",
    description: "Je cherche une équipe pour participer à des tournois.",
    icon: "🏃",
  },
  {
    value: "ORGANIZER",
    label: "Organisateur",
    description: "Je crée et gère des tournois sportifs.",
    icon: "🏆",
  },
];

export default function OnboardingForm({
  currentRole,
}: {
  currentRole: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const result = await setOwnRole(selected);
    setLoading(false);
    if (result.success) {
      // router.refresh() pour recharger la page dashboard avec le nouveau rôle
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <button
          key={role.value}
          type="button"
          onClick={() => setSelected(role.value)}
          className={`w-full text-left border rounded-xl p-4 transition-all ${
            selected === role.value
              ? "border-purple-600 bg-purple-50 ring-2 ring-purple-300"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{role.icon}</span>
            <div>
              <p className="font-semibold text-gray-900">{role.label}</p>
              <p className="text-sm text-gray-500">{role.description}</p>
            </div>
          </div>
        </button>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-purple-700 text-white rounded-xl font-medium hover:bg-purple-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "Enregistrement..." : "Continuer"}
      </button>
    </div>
  );
}
