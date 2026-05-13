import { z } from "zod";

export const tournamentSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères"),

  sport: z
    .string()
    .min(2, "Le sport est requis"),

  city: z
    .string()
    .min(2, "La ville est requise"),

  startDate: z.string(),

  entryFee: z.number().min(0),

  currency: z.string(),
});

export type TournamentInput =
  z.infer<typeof tournamentSchema>;