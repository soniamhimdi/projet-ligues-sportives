"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "../../lib/prisma";

import {
  createTournamentSchema,
  updateTournamentSchema,
  TournamentInput,
} from "../../lib/validations/tournament";

// =========================
// CREATE TOURNAMENT
// =========================

export async function createTournament(data: TournamentInput) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return { success: false, error: "Non authentifié" };

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return { success: false, error: "Utilisateur introuvable" };

    const validatedData = createTournamentSchema.parse(data);

    const tournament = await prisma.tournament.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        organizerId: user.id,
      },
    });

    return { success: true, tournament };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Erreur création tournoi" };
  }
}

// =========================
// UPDATE TOURNAMENT
// =========================

export async function updateTournament(id: string, data: TournamentInput) {
  try {
    const validatedData = updateTournamentSchema.parse(data);

    const tournament = await prisma.tournament.update({
      where: {
        id,
      },

      data: {
        ...validatedData,

        startDate: new Date(validatedData.startDate),
      },
    });

    return {
      success: true,
      tournament,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Erreur modification tournoi",
    };
  }
}

// =========================
// DELETE TOURNAMENT
// =========================

export async function deleteTournament(id: string) {
  try {
    await prisma.tournament.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Erreur suppression tournoi",
    };
  }
}
