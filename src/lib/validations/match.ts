import { z } from "zod";


// =========================
// MATCH SCHEMA
// =========================

export const matchSchema =
  z.object({
    teamAId: z
      .string()
      .min(1, "Équipe A requise"),

    teamBId: z
      .string()
      .min(1, "Équipe B requise"),

    date: z.string(),

    location: z
      .string()
      .min(
        2,
        "Lieu requis"
      ),

    scoreA: z
      .number()
      .nullable()
      .optional(),

    scoreB: z
      .number()
      .nullable()
      .optional(),
  })

  // empêcher même équipe
  .refine(
    (data) =>
      data.teamAId !==
      data.teamBId,
    {
      message:
        "Les équipes doivent être différentes",

      path: ["teamBId"],
    }
  );


// =========================
// UPDATE MATCH
// =========================

export const updateMatchSchema =
  matchSchema.extend({
    id: z.string().cuid(),
  });


// =========================
// TYPES
// =========================

export type MatchInput =
  z.infer<typeof matchSchema>;

export type UpdateMatchInput =
  z.infer<
    typeof updateMatchSchema
  >;