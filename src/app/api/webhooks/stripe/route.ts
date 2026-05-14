import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET manquant dans .env.local');
    return NextResponse.json({ error: 'Configuration serveur invalide' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Erreur vérification signature Stripe:', err);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const joinRequestId = session.metadata?.joinRequestId;

    if (!joinRequestId) {
      console.error('joinRequestId manquant dans les métadonnées Stripe', session.id);
      return NextResponse.json({ error: 'Métadonnées invalides' }, { status: 400 });
    }

    await prisma.joinRequest.update({
      where: { id: joinRequestId },
      data: {
        paymentStatus: 'PAID',
        paidAt: new Date(),
      },
    });
  }

  return NextResponse.json({ received: true });
}
