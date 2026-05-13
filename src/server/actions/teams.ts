"use server";

import prisma from "../../lib/prisma";

import {
  teamSchema,
  updateTeamSchema,
} from "@/lib/validations/team";

import type {
  TeamInput,
  UpdateTeamInput,
  DeleteTeamInput,
} from "@/lib/validations/team";


// =========================
// CREATE TEAM
// =========================

export async function createTeam(
  data: TeamInput
) {
  try {
    const validatedData =
      teamSchema.parse(data);

    const team =
      await prisma.team.create({
        data: {
          ...validatedData,
        },
      });

    return {
      success: true,
      team,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "Erreur création équipe",
    };
  }
}


// =========================
// UPDATE TEAM
// =========================

export async function updateTeam(
  id: string,
  data: TeamInput
) {
  try {
    const validatedData =
      teamSchema.parse(data);

    const team =
      await prisma.team.update({
        where: {
          id,
        },

        data: {
          ...validatedData,
        },
      });

    return {
      success: true,
      team,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur modification équipe",
    };
  }
}


// =========================
// DELETE TEAM
// =========================

export async function deleteTeam(
  id: string
) {
  try {
    // Vérifier si l'équipe a des membres
    const team =
      await prisma.team.findUnique({
        where: {
          id,
        },

        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
      });

    if (!team) {
      return {
        success: false,
        error:
          "Équipe introuvable",
      };
    }

    if (
      team._count.members > 0
    ) {
      return {
        success: false,
        error:
          "Impossible de supprimer une équipe avec des joueurs",
      };
    }

    await prisma.team.delete({
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
      error:
        "Erreur suppression équipe",
    };
  }
}