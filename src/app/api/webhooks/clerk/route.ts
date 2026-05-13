import { Webhook } from "svix";
import { headers } from "next/headers";
import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

type ClerkUserEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
    deleted?: boolean;
  };
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET manquant" },
      { status: 500 }
    );
  }

  // Récupère les headers Svix
  const headersList = await headers();
  const svixId        = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Headers Svix manquants" },
      { status: 400 }
    );
  }

  // Vérifie la signature
  const payload = await req.text();
  const wh = new Webhook(secret);
  let evt: ClerkUserEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json(
      { error: "Signature invalide" },
      { status: 400 }
    );
  }

  const { type, data } = evt;

  // user.created → on crée le User en base
  if (type === "user.created") {
    await prisma.user.create({
      data: {
        clerkId:  data.id,
        email:    data.email_addresses[0].email_address,
        fullName: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        role:     "PLAYER", // rôle par défaut
      },
    });
  }

  // user.updated → on met à jour email et nom
  if (type === "user.updated") {
    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        email:    data.email_addresses[0].email_address,
        fullName: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      },
    });
  }

  // user.deleted → on supprime le User (cascade sur profil + demandes)
  if (type === "user.deleted" && data.deleted) {
    await prisma.user.delete({
      where: { clerkId: data.id },
    });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}