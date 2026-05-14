import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Role } from "@/generated/prisma/enums";

// Synchronise le user Clerk avec la base de données.
// Crée le user en DB s'il n'existe pas encore.
export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { playerProfile: true },
  });

  if (existingUser) return existingUser;

  // Nouveau user → création en DB
  const newUser = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      fullName:
        `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      role: "PLAYER",
      onboarded: false,
    },
    include: { playerProfile: true },
  });

  return newUser;
}

// Retourne le user DB actuel sans le créer.
export async function getCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  return prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { playerProfile: true },
  });
}

export async function requireAuth() {
  const user = await syncUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function requireRole(role: Role) {
  const user = await requireAuth();
  if (user.role !== role && user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}
