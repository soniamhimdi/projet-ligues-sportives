"use client";

import { useState } from "react";

import {
  createJoinRequest,
} from "@/server/actions/join-requests";

interface Props {
  teamId: string;
}

export default function JoinTeamForm({
  teamId,
}: Props) {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      const result =
        await createJoinRequest({
          teamId,
          message,
        });

      if (result.success) {
        alert(
          "Demande envoyée"
        );

        setMessage("");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.log(error);

      alert(
        "Erreur serveur"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-xl p-4 space-y-4">
      <h2 className="text-2xl font-bold">
        Rejoindre l’équipe
      </h2>

      <textarea
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
        placeholder="Message optionnel"
        className="w-full border rounded-lg p-3"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading
          ? "Envoi..."
          : "Envoyer la demande"}
      </button>
    </div>
  );
}