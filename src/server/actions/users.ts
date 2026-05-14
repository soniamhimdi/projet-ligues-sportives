"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const roleSchema = z.enum(["PLAYER", "ORGANIZER"]);

// =========================
// CHANGER SON PROPRE RÔLE (onboarding)
// =========================
export async function setOwnRole(role: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return { success: false, error: "Rôle invalide" };

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      _count: {
        select: { joinRequests: true, teams: true, tournaments: true },
      },
    },
  });

  if (!user) return { success: false, error: "Utilisateur introuvable" };

  // Interdire si l'utilisateur a déjà de l'activité
  if (
    user._count.joinRequests > 0 ||
    user._count.teams > 0 ||
    user._count.tournaments > 0
  ) {
    return {
      success: false,
      error: "Impossible de changer de rôle avec des données existantes",
    };
  }

  // Mettre à jour le rôle en DB + marquer onboarded
  await prisma.user.update({
    where: { id: user.id },
    data: { role: parsed.data, onboarded: true },
  });

  // Marquer comme onboarded dans Clerk publicMetadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { onboarded: true },
  });

  revalidatePath("/");
  return { success: true, role: parsed.data };
}

// =========================
// ADMIN: CHANGER LE RÔLE D'UN UTILISATEUR
// =========================
export async function adminChangeUserRole(targetUserId: string, role: string) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Non authentifié" };

  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== "ADMIN") {
    return { success: false, error: "Accès refusé" };
  }

  const parsed = roleSchema.safeParse(role);
  if (!parsed.success) return { success: false, error: "Rôle invalide" };

  await prisma.user.update({
    where: { id: targetUserId },
    data: { role: parsed.data },
  });

  revalidatePath("/admin");
  return { success: true };
}
