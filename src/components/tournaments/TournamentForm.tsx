/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTournamentSchema,
  updateTournamentSchema,
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
      isEdit ? updateTournamentSchema : createTournamentSchema,
    ),
    defaultValues: {
      name: tournament?.name || "",
      sport: tournament?.sport || "",
      city: tournament?.city || "",
      startDate: tournament?.startDate
        ? new Date(tournament.startDate).toISOString().split("T")[0]
        : "",
      entryFee: tournament?.entryFee || 0,
      currency: tournament?.currency || "CAD",
      teams: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teams",
  });

  async function onSubmit(data: TournamentInput) {
    let result;

    if (isEdit && tournament) {
      result = await updateTournament(tournament.id, data);
    } else {
      result = await createTournament(data);
    }

    if (result.success) {
      alert(isEdit ? "Tournoi modifié" : "Tournoi créé");
      router.push("/tournaments");
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nom */}
        <div className="space-y-2">
          <label>Nom du tournoi</label>
          <Input placeholder="Coupe Montréal" {...form.register("name")} />
        </div>

        {/* Sport */}
        <div className="space-y-2">
          <label>Sport</label>
          <Input placeholder="Football" {...form.register("sport")} />
        </div>

        {/* Ville */}
        <div className="space-y-2">
          <label>Ville</label>
          <Input placeholder="Montréal" {...form.register("city")} />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label>Date de début</label>
          <Input type="date" {...form.register("startDate")} />
        </div>

        {/* Entry Fee */}
        <div className="space-y-2">
          <label>Frais d&apos;inscription</label>
          <Input
            type="number"
            {...form.register("entryFee", { valueAsNumber: true })}
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label>Devise</label>
          <Input placeholder="CAD" {...form.register("currency")} />
        </div>

        {/* Équipes — uniquement à la création */}
        {!isEdit && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium">Équipes</label>
              <button
                type="button"
                onClick={() => append({ name: "", maxCapacity: 15 })}
                className="text-sm text-purple-700 hover:text-purple-900 font-medium"
              >
                + Ajouter une équipe
              </button>
            </div>

            {fields.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                Aucune équipe — vous pouvez en ajouter maintenant ou plus tard.
              </p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-3 border rounded-lg p-3"
              >
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Nom de l'équipe"
                    {...form.register(`teams.${index}.name`)}
                  />
                  {form.formState.errors.teams?.[index]?.name && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.teams[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    placeholder="Max"
                    {...form.register(`teams.${index}.maxCapacity`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <Button type="submit">
          {isEdit ? "Modifier" : "Créer le tournoi"}
        </Button>
      </form>
    </div>
  );
}
