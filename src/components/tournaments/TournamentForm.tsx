/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  tournamentSchema,
  TournamentInput,
} from "../../lib/validations/tournament";

import {
  createTournament,
  updateTournament,
} from "../../server/actions/tournaments";

import { Button } from "../../../components/ui/button";

import { Input } from "../../../components/ui/input";

interface TournamentFormProps {
  tournament?: any;

  isEdit?: boolean;
}

export default function TournamentForm({
  tournament,
  isEdit = false,
}: TournamentFormProps) {
  const router = useRouter();

  const form = useForm<TournamentInput>({
    resolver: zodResolver(
      tournamentSchema
    ),

    defaultValues: {
      name:
        tournament?.name || "",

      sport:
        tournament?.sport || "",

      city:
        tournament?.city || "",

      startDate: tournament
        ?.startDate
        ? new Date(
            tournament.startDate
          )
            .toISOString()
            .split("T")[0]
        : "",

      entryFee:
        tournament?.entryFee || 0,

      currency:
        tournament?.currency ||
        "CAD",
    },
  });

  async function onSubmit(
    data: TournamentInput
  ) {
    let result;

    if (isEdit && tournament) {
      result =
        await updateTournament(
          tournament.id,
          data
        );
    } else {
      result =
        await createTournament(
          data
        );
    }

    if (result.success) {
      alert(
        isEdit
          ? "Tournoi modifié"
          : "Tournoi créé"
      );

      router.push("/tournaments");
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="max-w-xl">
      <form
        onSubmit={form.handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >
        {/* Nom */}
        <div className="space-y-2">
          <label>
            Nom du tournoi
          </label>

          <Input
            placeholder="Coupe Montréal"
            {...form.register("name")}
          />
        </div>

        {/* Sport */}
        <div className="space-y-2">
          <label>Sport</label>

          <Input
            placeholder="Football"
            {...form.register("sport")}
          />
        </div>

        {/* Ville */}
        <div className="space-y-2">
          <label>Ville</label>

          <Input
            placeholder="Montréal"
            {...form.register("city")}
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label>
            Date de début
          </label>

          <Input
            type="date"
            {...form.register(
              "startDate"
            )}
          />
        </div>

        {/* Entry Fee */}
        <div className="space-y-2">
          <label>
            Frais dinscription
          </label>

          <Input
            type="number"
            {...form.register(
              "entryFee",
              {
                valueAsNumber: true,
              }
            )}
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label>Devise</label>

          <Input
            placeholder="CAD"
            {...form.register(
              "currency"
            )}
          />
        </div>

        <Button type="submit">
          {isEdit
            ? "Modifier"
            : "Créer le tournoi"}
        </Button>
      </form>
    </div>
  );
}