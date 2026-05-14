# Ligues Sportives Communautaires

Plateforme web communautaire qui connecte organisateurs et joueurs passionnés dans leur région. Les organisateurs créent des tournois et des équipes ; les joueurs envoient des demandes d'adhésion et paient leur inscription directement via Stripe.

---

## Technologies utilisées

| Couche | Technologie | Version |
|---|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router, Turbopack) | 16.2.6 |
| Langage | TypeScript | 5.x |
| Authentification | [Clerk](https://clerk.com/) | @clerk/nextjs 7.3.3 |
| Base de données | PostgreSQL via [Neon](https://neon.tech/) (serverless) | — |
| ORM | [Prisma](https://www.prisma.io/) | 7.8.0 |
| Paiement | [Stripe](https://stripe.com/) (mode test) | 22.1.1 |
| UI | Tailwind CSS v4 + shadcn/ui | — |
| Validation | Zod | — |
| Webhooks Clerk | svix | 1.93.0 |

---

## Fonctionnalités principales

- **Rôles** : PLAYER · ORGANIZER · ADMIN (choix à l'onboarding)
- **Organisateurs** : créer / modifier des tournois (avec frais d'inscription), créer des équipes, accepter ou rejeter les demandes d'adhésion
- **Joueurs** : consulter les équipes, envoyer une demande d'adhésion, payer les tournois payants via Stripe Checkout, voir l'état de ses demandes
- **Admin** : accès à toutes les pages
- **Paiement** : Stripe Checkout en mode test, confirmation automatique à la page de succès

---

## Prérequis

- **Node.js** ≥ 20 et **npm** ≥ 10
- Compte [Neon](https://neon.tech/) — base de données PostgreSQL serverless (plan gratuit suffisant)
- Compte [Clerk](https://clerk.com/) — authentification (plan gratuit suffisant)
- Compte [Stripe](https://stripe.com/) — paiements en **mode test** (aucune carte réelle nécessaire)

---

## Installation pas à pas

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd projet-ligues-sportives
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer le fichier `.env.local` à la racine du projet (voir section [Variables d'environnement](#variables-denvironnement)).

### 4. Appliquer les migrations Prisma

```bash
npx prisma migrate deploy
```

### 5. (Optionnel) Peupler la base avec des données de test

```bash
npm run seed
```

### 6. Lancer le serveur de développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# ─────────────────────────────────────────
# BASE DE DONNÉES — Neon PostgreSQL
# ─────────────────────────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"

# ─────────────────────────────────────────
# CLERK — Authentification
# ─────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

CLERK_WEBHOOK_SECRET=whsec_...

# ─────────────────────────────────────────
# STRIPE — Paiements (mode test)
# ─────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─────────────────────────────────────────
# APPLICATION
# ─────────────────────────────────────────
APP_URL=http://localhost:3000
```

### Où trouver chaque valeur

| Variable | Source |
|---|---|
| `DATABASE_URL` | [console.neon.tech](https://console.neon.tech) → projet → **Connection string** (mode pooled) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) → app → **API Keys** |
| `CLERK_SECRET_KEY` | Même page |
| `CLERK_WEBHOOK_SECRET` | Dashboard Clerk → **Webhooks** → endpoint → **Signing Secret** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) |
| `STRIPE_SECRET_KEY` | Même page (cliquer Reveal) |
| `STRIPE_WEBHOOK_SECRET` | Dashboard Stripe → **Webhooks** → endpoint → **Signing secret** |

---

## Configuration des webhooks

### Clerk Webhook

1. Dashboard Clerk → **Webhooks** → **Add Endpoint**
2. URL : `https://VOTRE_DOMAINE/api/webhooks/clerk`
3. Événements : `user.created`, `user.updated`, `user.deleted`
4. Copier le **Signing Secret** → `CLERK_WEBHOOK_SECRET`

### Stripe Webhook (production)

1. Dashboard Stripe → **Webhooks** → **Add endpoint**
2. URL : `https://VOTRE_DOMAINE/api/webhooks/stripe`
3. Événement : `checkout.session.completed`
4. Copier le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Stripe Webhook (développement local)

```bash
# Installer Stripe CLI : https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copier le secret whsec_... affiché dans STRIPE_WEBHOOK_SECRET
```

---

## Commandes utiles

```bash
# Développement
npm run dev               # Serveur dev Turbopack (http://localhost:3000)
npm run build             # Build de production
npm run start             # Démarrer le build de production
npm run lint              # Vérifier le code avec ESLint

# Base de données
npx prisma migrate dev    # Créer et appliquer une nouvelle migration
npx prisma migrate deploy # Appliquer les migrations (CI / production)
npx prisma studio         # Interface graphique DB (http://localhost:5555)
npx prisma generate       # Régénérer le client Prisma
npx prisma db push        # Synchroniser le schéma sans migration (dev rapide)

# Données de test
npm run seed              # Peupler la DB avec des tournois et équipes de démonstration
```

---

## Structure du projet

```
src/
├── app/
│   ├── (auth)/               # Pages Clerk : /sign-in, /sign-up
│   ├── (organizer)/          # Tournois, équipes, demandes reçues
│   ├── (player)/             # Mes demandes, profil, équipes
│   ├── admin/                # Pages admin
│   ├── api/
│   │   ├── webhooks/clerk/   # Webhook : user.created / updated / deleted
│   │   └── webhooks/stripe/  # Webhook : checkout.session.completed
│   ├── checkout/             # Pages succès / annulation Stripe
│   └── dashboard/            # Tableau de bord + onboarding inline
├── components/               # Composants UI réutilisables
├── lib/
│   ├── auth.ts               # syncUser · requireAuth · requireRole
│   ├── prisma.ts             # Singleton Prisma
│   └── stripe.ts             # Singleton Stripe
├── server/actions/           # Server Actions Next.js
│   ├── checkout.ts           # Création session Stripe Checkout
│   ├── join-requests.ts      # CRUD demandes d'adhésion
│   ├── teams.ts              # CRUD équipes
│   ├── tournaments.ts        # CRUD tournois
│   └── users.ts              # Rôle / onboarding
└── middleware.ts             # Protection des routes (Clerk)

prisma/
├── schema.prisma             # Schéma de la base de données
├── seed.ts                   # Script de seed
└── migrations/               # Historique des migrations SQL
```

---

## Flux de paiement Stripe

```
Joueur → "Rejoindre l'équipe" (tournoi payant)
  └─ createJoinRequest()  →  paymentStatus: PENDING
        └─ createCheckoutSession()  →  URL Stripe Checkout
              └─ window.location.href = url
                    ├─ Paiement réussi  →  /checkout/success?session_id=...
                    │     └─ Vérifie session via API Stripe
                    │     └─ paymentStatus: PAID  (DB mise à jour)
                    └─ Paiement annulé  →  /checkout/cancel  →  /my-requests
```

---

## Cartes de test Stripe

| Numéro | Résultat |
|---|---|
| `4242 4242 4242 4242` | Paiement réussi ✅ |
| `4000 0000 0000 9995` | Refusée — fonds insuffisants ❌ |
| `4000 0025 0000 3155` | Authentification 3D Secure requise 🔐 |

> Date d'expiration : n'importe quelle date future · CVC : 3 chiffres quelconques

---

## Modèle de données

```
User ──────────────── PlayerProfile
  │                       (ville, sport favori, niveau)
  ├── Tournament[]         (organisateur)
  ├── Team[]               (membre)
  └── JoinRequest[]
         │
         └── Team ──── Tournament
                         (entryFee en cents, currency)
```

**États d'une JoinRequest :**
- `status` : `PENDING` → `ACCEPTED` | `REJECTED`
- `paymentStatus` : `NOT_REQUIRED` | `PENDING` | `PAID`

---

## Licence

Projet académique — AEC Développement Web · 2026
