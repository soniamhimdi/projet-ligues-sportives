import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma  from "@/lib/prisma";
import type {Role}   from "@prisma/client";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  // Cherche le user en base
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { playerProfile: true },
  });

  // Pas encore en base → on le crée depuis Clerk
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    user = await prisma.user.create({
      data: {
        clerkId:  clerkUser.id,
        email:    clerkUser.emailAddresses[0].emailAddress,
        fullName: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        role:     "PLAYER",
      },
      include: { playerProfile: true },
    });

    console.log("✅ User créé en base :", user.email);
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function requireRole(role: Role) {
  const user = await requireAuth();
  if (user.role !== role && user.role !== "ADMIN") {
    redirect("/");
  }
  return user;
}