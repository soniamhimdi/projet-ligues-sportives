import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Démarrage du seed...");

  // ─── Nettoyage ────────────────────────────────────────────────
  await prisma.match.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.team.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.playerProfile.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // ─── Utilisateurs ─────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      clerkId: "seed_admin_001",
      email: "admin@ligues.ca",
      fullName: "Admin Principal",
      role: "ADMIN",
    },
  });

  const organizer1 = await prisma.user.create({
    data: {
      clerkId: "seed_org_001",
      email: "organisateur1@ligues.ca",
      fullName: "Marie Tremblay",
      role: "ORGANIZER",
    },
  });

  const organizer2 = await prisma.user.create({
    data: {
      clerkId: "seed_org_002",
      email: "organisateur2@ligues.ca",
      fullName: "Jean Bouchard",
      role: "ORGANIZER",
    },
  });

  const players = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: "seed_player_001",
        email: "joueur1@ligues.ca",
        fullName: "Lucas Martin",
        role: "PLAYER",
        playerProfile: {
          create: {
            city: "Montréal",
            favoriteSport: "Soccer",
            level: "INTERMEDIATE",
            position: "Attaquant",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "seed_player_002",
        email: "joueur2@ligues.ca",
        fullName: "Sofia Leblanc",
        role: "PLAYER",
        playerProfile: {
          create: {
            city: "Québec",
            favoriteSport: "Basketball",
            level: "ADVANCED",
            position: "Meneur",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "seed_player_003",
        email: "joueur3@ligues.ca",
        fullName: "Antoine Gagnon",
        role: "PLAYER",
        playerProfile: {
          create: {
            city: "Laval",
            favoriteSport: "Soccer",
            level: "BEGINNER",
            position: "Défenseur",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "seed_player_004",
        email: "joueur4@ligues.ca",
        fullName: "Camille Fortin",
        role: "PLAYER",
        playerProfile: {
          create: {
            city: "Montréal",
            favoriteSport: "Volleyball",
            level: "INTERMEDIATE",
            position: "Libéro",
          },
        },
      },
    }),
  ]);

  console.log(`✅ ${players.length + 3} utilisateurs créés`);

  // ─── Tournois ─────────────────────────────────────────────────
  const tournament1 = await prisma.tournament.create({
    data: {
      name: "Coupe de Montréal 2026",
      sport: "Soccer",
      city: "Montréal",
      startDate: new Date("2026-07-15"),
      entryFee: 5000,
      currency: "CAD",
      organizerId: organizer1.id,
    },
  });

  const tournament2 = await prisma.tournament.create({
    data: {
      name: "Tournoi Basket Québec",
      sport: "Basketball",
      city: "Québec",
      startDate: new Date("2026-08-01"),
      entryFee: 0,
      currency: "CAD",
      organizerId: organizer2.id,
    },
  });

  console.log("✅ 2 tournois créés");

  // ─── Équipes ──────────────────────────────────────────────────
  const teamA = await prisma.team.create({
    data: {
      name: "Les Aigles",
      tournamentId: tournament1.id,
      maxCapacity: 11,
      members: {
        connect: [{ id: players[0].id }, { id: players[2].id }],
      },
    },
  });

  const teamB = await prisma.team.create({
    data: {
      name: "Les Lions",
      tournamentId: tournament1.id,
      maxCapacity: 11,
      members: {
        connect: [{ id: players[3].id }],
      },
    },
  });

  const teamC = await prisma.team.create({
    data: {
      name: "Les Rapides",
      tournamentId: tournament2.id,
      maxCapacity: 10,
      members: {
        connect: [{ id: players[1].id }],
      },
    },
  });

  console.log("✅ 3 équipes créées");

  // ─── Demandes d'adhésion ──────────────────────────────────────
  await prisma.joinRequest.create({
    data: {
      playerId: players[1].id,
      teamId: teamA.id,
      status: "PENDING",
      message: "Je veux rejoindre votre équipe !",
      paymentStatus: "NOT_REQUIRED",
    },
  });

  await prisma.joinRequest.create({
    data: {
      playerId: players[2].id,
      teamId: teamC.id,
      status: "ACCEPTED",
      paymentStatus: "NOT_REQUIRED",
    },
  });

  console.log("✅ 2 demandes d'adhésion créées");

  // ─── Match ────────────────────────────────────────────────────
  await prisma.match.create({
    data: {
      teamAId: teamA.id,
      teamBId: teamB.id,
      date: new Date("2026-07-20T14:00:00"),
      location: "Stade Saputo, Montréal",
      scoreA: null,
      scoreB: null,
    },
  });

  console.log("✅ 1 match créé");

  // ─── Produits ─────────────────────────────────────────────────
  await prisma.product.createMany({
    data: [
      {
        name: "Maillot officiel",
        description: "Maillot de la ligue — taille adulte",
        price: 49.99,
      },
      {
        name: "Short de sport",
        description: "Short respirant pour tous les sports",
        price: 29.99,
      },
      {
        name: "Inscription tournoi",
        description: "Frais d'inscription au tournoi",
        price: 50.0,
      },
    ],
  });

  console.log("✅ 3 produits créés");
  console.log("\n🎉 Seed terminé avec succès !");
  console.log(`   Admin    : ${admin.email}`);
  console.log(`   Org 1    : ${organizer1.email}`);
  console.log(`   Org 2    : ${organizer2.email}`);
  console.log(`   Joueurs  : ${players.map((p) => p.email).join(", ")}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed :", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
