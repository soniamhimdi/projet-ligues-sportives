"use client";

import { cancelJoinRequest } from "@/server/actions/join-requests";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelRequestButton({
  requestId,
}: {
  requestId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Annuler cette demande ?")) return;
    setLoading(true);
    const result = await cancelJoinRequest(requestId);
    setLoading(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
    >
      {loading ? "Annulation..." : "Annuler la demande"}
    </button>
  );
}
