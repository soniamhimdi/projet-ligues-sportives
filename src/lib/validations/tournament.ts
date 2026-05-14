import { z } from "zod";

// =========================
// CREATE TOURNAMENT
// =========================

export const teamInTournamentSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  maxCapacity: z.number().min(1).max(50),
});

export const createTournamentSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),

  sport: z.string().min(2, "Le sport est requis"),

  city: z.string().min(2, "La ville est requise"),

  startDate: z.string(),

  entryFee: z.number().min(0, "Le prix doit être positif"),

  currency: z.string().min(1, "La devise est requise"),

  teams: z.array(teamInTournamentSchema).optional(),
});

// =========================
// UPDATE TOURNAMENT
// =========================

export const updateTournamentSchema = createTournamentSchema.extend({
  id: z.string().cuid(),
});

// =========================
// DELETE TOURNAMENT
// =========================

export const deleteTournamentSchema = z.object({
  id: z.string().cuid(),
});

// =========================
// TYPES
// =========================

export type TournamentInput = z.infer<typeof createTournamentSchema>;

export type UpdateTournamentInput = z.infer<typeof updateTournamentSchema>;

export type DeleteTournamentInput = z.infer<typeof deleteTournamentSchema>;
