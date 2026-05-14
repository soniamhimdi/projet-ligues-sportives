"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  matchSchema,
} from "@/lib/validations/match";

import type {
  MatchInput,
} from "@/lib/validations/match";

import {
  createMatch,
  updateMatch,
} from "@/server/actions/matches";

interface Props {
  teams: any[];

  match?: any;

  isEdit?: boolean;
}

export default function MatchForm({
  teams,
  match,
  isEdit = false,
}: Props) {
  const router = useRouter();

  const form =
    useForm<MatchInput>({
      resolver:
        zodResolver(
          matchSchema
        ),

      defaultValues: {
        teamAId:
          match?.teamAId ||
          "",

        teamBId:
          match?.teamBId ||
          "",

        date: match?.date
          ? new Date(
              match.date
            )
              .toISOString()
              .slice(0, 16)
          : "",

        location:
          match?.location ||
          "",

        scoreA:
          match?.scoreA ??
          undefined,

        scoreB:
          match?.scoreB ??
          undefined,
      },
    });

  async function onSubmit(
    data: MatchInput
  ) {
    let result;

    if (isEdit && match) {
      result =
        await updateMatch(
          match.id,
          data
        );
    } else {
      result =
        await createMatch(
          data
        );
    }

    if (result.success) {
      alert(
        isEdit
          ? "Match modifié"
          : "Match créé"
      );

      router.push(
        "/matches"
      );
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
        {/* Team A */}
        <div className="space-y-2">
          <label>
            Équipe A
          </label>

          <select
            className="w-full border rounded-lg p-2"
            {...form.register(
              "teamAId"
            )}
          >
            <option value="">
              Choisir une équipe
            </option>

            {teams.map(
              (team) => (
                <option
                  key={team.id}
                  value={
                    team.id
                  }
                >
                  {team.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Team B */}
        <div className="space-y-2">
          <label>
            Équipe B
          </label>

          <select
            className="w-full border rounded-lg p-2"
            {...form.register(
              "teamBId"
            )}
          >
            <option value="">
              Choisir une équipe
            </option>

            {teams.map(
              (team) => (
                <option
                  key={team.id}
                  value={
                    team.id
                  }
                >
                  {team.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label>
            Date du match
          </label>

          <input
            type="datetime-local"
            className="w-full border rounded-lg p-2"
            {...form.register(
              "date"
            )}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label>
            Lieu
          </label>

          <input
            type="text"
            placeholder="Centre sportif Montréal"
            className="w-full border rounded-lg p-2"
            {...form.register(
              "location"
            )}
          />
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>
              Score équipe A
            </label>

            <input
              type="number"
              className="w-full border rounded-lg p-2"
              {...form.register(
                "scoreA",
                {
                  valueAsNumber: true,
                }
              )}
            />
          </div>

          <div className="space-y-2">
            <label>
              Score équipe B
            </label>

            <input
              type="number"
              className="w-full border rounded-lg p-2"
              {...form.register(
                "scoreB",
                {
                  valueAsNumber: true,
                }
              )}
            />
          </div>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded-lg">
          {isEdit
            ? "Modifier"
            : "Créer le match"}
        </button>
      </form>
    </div>
  );
}