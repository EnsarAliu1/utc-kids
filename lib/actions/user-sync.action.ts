"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";

function resolveRole(email: string): Role {
  return email === process.env.ADMIN_EMAIL ? Role.ADMIN : Role.TEACHER;
}

export async function syncClerkUserToDB() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress!;
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Përdorues UTC Kids";
  const role = resolveRole(email);

  return prisma.user.upsert({
    where: { id: user.id },
    update: { clerkId: user.id, name, email, role },
    create: { id: user.id, clerkId: user.id, name, email, role },
  });
}

