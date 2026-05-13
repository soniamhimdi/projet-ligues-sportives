import { z } from "zod";


// =========================
// CREATE JOIN REQUEST
// =========================

export const joinRequestSchema =
  z.object({
    teamId: z
      .string()
      .min(
        1,
        "L'équipe est requise"
      ),

    message: z
      .string()
      .max(
        500,
        "Maximum 500 caractères"
      )
      .optional(),
  });


// =========================
// ACCEPT REQUEST
// =========================

export const acceptJoinRequestSchema =
  z.object({
    id: z.string().cuid(),
  });


// =========================
// REJECT REQUEST
// =========================

export const rejectJoinRequestSchema =
  z.object({
    id: z.string().cuid(),
  });


// =========================
// CANCEL REQUEST
// =========================

export const cancelJoinRequestSchema =
  z.object({
    id: z.string().cuid(),
  });


// =========================
// TYPES
// =========================

export type JoinRequestInput =
  z.infer<
    typeof joinRequestSchema
  >;

export type AcceptJoinRequestInput =
  z.infer<
    typeof acceptJoinRequestSchema
  >;

export type RejectJoinRequestInput =
  z.infer<
    typeof rejectJoinRequestSchema
  >;

export type CancelJoinRequestInput =
  z.infer<
    typeof cancelJoinRequestSchema
  >;