"use server";

import { getCurrentUser } from "@/lib/auth";
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
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "Non authentifié" };

    const validatedData = createTournamentSchema.parse(data);

    const { teams, ...tournamentData } = validatedData;

    const tournament = await prisma.tournament.create({
      data: {
        ...tournamentData,
        startDate: new Date(validatedData.startDate),
        organizerId: user.id,
        ...(teams && teams.length > 0
          ? {
              teams: {
                create: teams.map((t) => ({
                  name: t.name,
                  maxCapacity: t.maxCapacity,
                })),
              },
            }
          : {}),
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
