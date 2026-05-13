"use server";

import prisma from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";

import {
  joinRequestSchema,
  acceptJoinRequestSchema,
  rejectJoinRequestSchema,
  cancelJoinRequestSchema,
} from "@/lib/validations/join-request";

import type {
  JoinRequestInput,
} from "@/lib/validations/join-request";


// =========================
// CREATE JOIN REQUEST
// =========================

export async function createJoinRequest(
  data: JoinRequestInput
) {
  try {
    const { userId } =
      await auth();

    if (!userId) {
      return {
        success: false,
        error: "Non autorisé",
      };
    }

    const validatedData =
      joinRequestSchema.parse(
        data
      );

    // user prisma
    const user =
      await prisma.user.findUnique({
        where: {
          clerkId: userId,
        },
      });

    if (!user) {
      return {
        success: false,
        error:
          "Utilisateur introuvable",
      };
    }

    // vérifier équipe
    const team =
      await prisma.team.findUnique({
        where: {
          id: validatedData.teamId,
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

    // équipe pleine
    if (
      team._count.members >=
      team.maxCapacity
    ) {
      return {
        success: false,
        error:
          "Équipe pleine",
      };
    }

    // vérifier demande existante
    const existingRequest =
      await prisma.joinRequest.findUnique(
        {
          where: {
            playerId_teamId: {
              playerId:
                user.id,

              teamId:
                validatedData.teamId,
            },
          },
        }
      );

    if (existingRequest) {
      return {
        success: false,
        error:
          "Demande déjà envoyée",
      };
    }

    // création demande
    const request =
      await prisma.joinRequest.create({
        data: {
          playerId: user.id,

          teamId:
            validatedData.teamId,

          message:
            validatedData.message,
        },
      });

    revalidatePath("/teams");

    revalidatePath(
      "/my-requests"
    );

    return {
      success: true,
      request,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur création demande",
    };
  }
}


// =========================
// ACCEPT REQUEST
// =========================

export async function acceptJoinRequest(
  id: string
) {
  try {
    acceptJoinRequestSchema.parse({
      id,
    });

    const request =
      await prisma.joinRequest.findUnique({
        where: {
          id,
        },

        include: {
          team: {
            include: {
              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
        },
      });

    if (!request) {
      return {
        success: false,
        error:
          "Demande introuvable",
      };
    }

    // équipe pleine
    if (
      request.team._count
        .members >=
      request.team.maxCapacity
    ) {
      return {
        success: false,
        error:
          "Équipe pleine",
      };
    }

    // transaction
    await prisma.$transaction([
      prisma.team.update({
        where: {
          id: request.teamId,
        },

        data: {
          members: {
            connect: {
              id: request.playerId,
            },
          },
        },
      }),

      prisma.joinRequest.update({
        where: {
          id,
        },

        data: {
          status:
            "ACCEPTED",
        },
      }),
    ]);

    revalidatePath(
      "/requests"
    );

    revalidatePath(
      "/teams"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur acceptation",
    };
  }
}


// =========================
// REJECT REQUEST
// =========================

export async function rejectJoinRequest(
  id: string
) {
  try {
    rejectJoinRequestSchema.parse({
      id,
    });

    await prisma.joinRequest.update({
      where: {
        id,
      },

      data: {
        status:
          "REJECTED",
      },
    });

    revalidatePath(
      "/requests"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur refus demande",
    };
  }
}


// =========================
// CANCEL REQUEST
// =========================

export async function cancelJoinRequest(
  id: string
) {
  try {
    cancelJoinRequestSchema.parse({
      id,
    });

    await prisma.joinRequest.delete({
      where: {
        id,
      },
    });

    revalidatePath(
      "/my-requests"
    );

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error:
        "Erreur annulation",
    };
  }
}