"use client";

import {
  acceptJoinRequest,
  rejectJoinRequest,
} from "@/server/actions/join-requests";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AcceptRejectButtons({
  requestId,
}: {
  requestId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  async function handleAccept() {
    setLoading("accept");
    const result = await acceptJoinRequest(requestId);
    setLoading(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  async function handleReject() {
    if (!confirm("Refuser cette demande ?")) return;
    setLoading("reject");
    const result = await rejectJoinRequest(requestId);
    setLoading(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={handleAccept}
        disabled={loading !== null}
        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading === "accept" ? "Acceptation..." : "Accepter"}
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
      >
        {loading === "reject" ? "Refus..." : "Refuser"}
      </button>
    </div>
  );
}
