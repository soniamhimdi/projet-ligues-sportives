import { z } from "zod";


// =========================
// CREATE TOURNAMENT
// =========================

export const createTournamentSchema =
  z.object({
    name: z
      .string()
      .min(
        3,
        "Le nom doit contenir au moins 3 caractères"
      ),

    sport: z
      .string()
      .min(2, "Le sport est requis"),

    city: z
      .string()
      .min(2, "La ville est requise"),

    startDate: z.string(),

    entryFee: z
      .number()
      .min(0, "Le prix doit être positif"),

    currency: z
      .string()
      .min(1, "La devise est requise"),
  });


// =========================
// UPDATE TOURNAMENT
// =========================

export const updateTournamentSchema =
  createTournamentSchema.extend({
    id: z.string().cuid(),
  });


// =========================
// DELETE TOURNAMENT
// =========================

export const deleteTournamentSchema =
  z.object({
    id: z.string().cuid(),
  });


// =========================
// TYPES
// =========================

export type TournamentInput =
  z.infer<
    typeof createTournamentSchema
  >;

export type UpdateTournamentInput =
  z.infer<
    typeof updateTournamentSchema
  >;

export type DeleteTournamentInput =
  z.infer<
    typeof deleteTournamentSchema
  >;