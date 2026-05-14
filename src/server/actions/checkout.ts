'use server';

import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';

const createCheckoutSessionSchema = z.object({
  joinRequestId: z.string().cuid('joinRequestId invalide'),
});

type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non autorisé');

  const parsed = createCheckoutSessionSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { joinRequestId } = parsed.data;

  // Récupérer la demande + équipe + tournoi pour obtenir entryFee
  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id: joinRequestId },
    include: {
      team: {
        include: {
          tournament: true,
        },
      },
    },
  });

  if (!joinRequest) throw new Error('Demande introuvable');

  // Sécurité : seul le joueur concerné peut payer
  if (joinRequest.playerId !== user.id) throw new Error('Accès refusé');

  if (joinRequest.paymentStatus === 'PAID') {
    throw new Error('Cette demande est déjà payée');
  }

  const { tournament } = joinRequest.team;

  if (tournament.entryFee <= 0) {
    throw new Error('Ce tournoi est gratuit, aucun paiement requis');
  }

  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error('APP_URL est manquante dans .env.local');

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: tournament.currency.toLowerCase(),
          product_data: {
            name: `Inscription — ${joinRequest.team.name}`,
            description: `Tournoi : ${tournament.name} | ${tournament.sport} | ${tournament.city}`,
          },
          unit_amount: tournament.entryFee, // déjà en cents dans la DB
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout/cancel`,
    metadata: {
      joinRequestId: joinRequest.id,
      userId: user.id,
    },
    locale: 'fr',
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe n'a pas retourné d'URL de paiement");
  }

  // Sauvegarder l'ID de session Stripe sur la demande
  await prisma.joinRequest.update({
    where: { id: joinRequestId },
    data: { stripeSessionId: checkoutSession.id },
  });

  redirect(checkoutSession.url);
}
