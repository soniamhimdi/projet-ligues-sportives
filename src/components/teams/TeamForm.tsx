/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  teamSchema,
  TeamInput,
} from "@/lib/validations/team";

import {
  createTeam,
  updateTeam,
} from "../../server/actions/teams";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

interface TeamFormProps {
  tournaments: any[];

  team?: any;

  isEdit?: boolean;
}

export default function TeamForm({
  tournaments,
  team,
  isEdit = false,
}: TeamFormProps) {
  const router = useRouter();

  const form = useForm<TeamInput>({
    resolver:
      zodResolver(teamSchema),

    defaultValues: {
      name:
        team?.name || "",

      tournamentId:
        team?.tournamentId || "",

      maxCapacity:
        team?.maxCapacity || 10,
    },
  });

  async function onSubmit(
    data: TeamInput
  ) {
    let result;

    if (isEdit && team) {
      result =
        await updateTeam(
          team.id,
          data
        );
    } else {
      result =
        await createTeam(
          data
        );
    }

    if (result.success) {
      alert(
        isEdit
          ? "Équipe modifiée"
          : "Équipe créée"
      );

      router.push("/teams");
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
            Nom de l’équipe
          </label>

          <Input
            placeholder="Team Montréal"
            {...form.register("name")}
          />
        </div>

        {/* Tournament */}
        <div className="space-y-2">
          <label>
            Tournoi parent
          </label>

          <select
            className="w-full border rounded-lg p-2"
            {...form.register(
              "tournamentId"
            )}
          >
            <option value="">
              Choisir un tournoi
            </option>

            {tournaments.map(
              (tournament) => (
                <option
                  key={
                    tournament.id
                  }
                  value={
                    tournament.id
                  }
                >
                  {tournament.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Max Capacity */}
        <div className="space-y-2">
          <label>
            Capacité maximale
          </label>

          <Input
            type="number"
            {...form.register(
              "maxCapacity",
              {
                valueAsNumber: true,
              }
            )}
          />
        </div>

        <Button type="submit">
          {isEdit
            ? "Modifier"
            : "Créer l’équipe"}
        </Button>
      </form>
    </div>
  );
}