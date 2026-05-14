"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminChangeUserRole } from "@/server/actions/users";

const ROLES = ["PLAYER", "ORGANIZER", "ADMIN"] as const;
const roleLabel: Record<string, string> = {
  PLAYER: "Joueur",
  ORGANIZER: "Organisateur",
  ADMIN: "Admin",
};

export default function AdminRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    if (newRole === currentRole) return;
    if (!confirm(`Changer le rôle vers ${roleLabel[newRole]} ?`)) return;

    setLoading(true);
    const result = await adminChangeUserRole(userId, newRole);
    setLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <select
      defaultValue={currentRole}
      onChange={handleChange}
      disabled={loading}
      className="text-sm border rounded-lg px-2 py-1 disabled:opacity-50"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {roleLabel[r]}
        </option>
      ))}
    </select>
  );
}
