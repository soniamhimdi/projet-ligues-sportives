import { z } from "zod";


// =========================
// CREATE TEAM
// =========================

export const teamSchema =
  z.object({
    name: z
      .string()
      .min(
        2,
        "Le nom doit contenir au moins 2 caractères"
      ),

    tournamentId: z
      .string()
      .min(
        1,
        "Le tournoi est requis"
      ),

    maxCapacity: z
      .number()
      .min(
        1,
        "Minimum 1 joueur"
      )
      .max(
        50,
        "Maximum 50 joueurs"
      ),
  });


// =========================
// UPDATE TEAM
// =========================

export const updateTeamSchema =
  teamSchema.extend({
    id: z.string().cuid(),
  });


// =========================
// DELETE TEAM
// =========================

export const deleteTeamSchema =
  z.object({
    id: z.string().cuid(),
  });


// =========================
// TYPES
// =========================

export type TeamInput =
  z.infer<typeof teamSchema>;

export type UpdateTeamInput =
  z.infer<
    typeof updateTeamSchema
  >;

export type DeleteTeamInput =
  z.infer<
    typeof deleteTeamSchema
  >;