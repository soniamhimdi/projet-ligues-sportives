"use server";

import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";

import {
  updateMatchSchema,
  matchSchema
} from "../../lib/validations/match";

import type {
  MatchInput,
  UpdateMatchInput,
} from "../../lib/validations/match";


// =========================
// CREATE MATCH
// =========================

export async function createMatch(
  data: MatchInput
) {
  try {
    const validatedData =
      matchSchema.parse(data);
    // vérifier équipes
const teamA =
  await prisma.team.findUnique({
    where: {
      id:
        validatedData.teamAId,
    },
  });

const teamB =
  await prisma.team.findUnique({
    where: {
      id:
        validatedData.teamBId,
    },
  });

if (!teamA || !teamB) {
  return {
    success: false,
    error:
      "Équipe introuvable",
  };
}

// même tournoi obligatoire
if (
  teamA.tournamentId !==
  teamB.tournamentId
) {
  return {
    success: false,
    error:
      "Les équipes doivent appartenir au même tournoi",
  };
}
    const match =
      await prisma.match.create({
        data: {
          teamAId:
            validatedData.teamAId,

          teamBId:
            validatedData.teamBId,

          date: new Date(
            validatedData.date
          ),

          location:
            validatedData.location,

          scoreA:
            validatedData.scoreA,

          scoreB:
            validatedData.scoreB,
        },
      });

    revalidatePath("/matches");

    return {
      success: true,
      match,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur création match",
    };
  }
}


// =========================
// UPDATE MATCH
// =========================

export async function updateMatch(
  id: string,
  data: MatchInput
) {
  try {
    const validatedData =
      matchSchema.parse(data);

    const match =
      await prisma.match.update({
        where: {
          id,
        },

        data: {
          teamAId:
            validatedData.teamAId,

          teamBId:
            validatedData.teamBId,

          date: new Date(
            validatedData.date
          ),

          location:
            validatedData.location,

          scoreA:
            validatedData.scoreA,

          scoreB:
            validatedData.scoreB,
        },
      });

    revalidatePath("/matches");

    return {
      success: true,
      match,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur modification match",
    };
  }
}
// =========================
// DELETE MATCH
// =========================

export async function deleteMatch(
  id: string
) {
  try {
    await prisma.match.delete({
      where: {
        id,
      },
    });

    revalidatePath("/matches");

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur suppression match",
    };
  }
}