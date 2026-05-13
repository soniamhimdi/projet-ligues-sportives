"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJoinRequest } from "@/server/actions/join-requests";

export default function JoinTeamButton({ teamId }: { teamId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await createJoinRequest({ teamId, message: message || undefined });
    setLoading(false);
    if (result.success) {
      alert("Demande envoyée !");
      setOpen(false);
      setMessage("");
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Rejoindre l&apos;équipe
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optionnel)"
        maxLength={500}
        className="w-full border rounded-lg p-2 text-sm"
        rows={3}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer la demande"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
