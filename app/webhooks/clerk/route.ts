import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

function resolveRole(email: string): Role {
  return email === process.env.ADMIN_EMAIL ? Role.ADMIN : Role.TEACHER;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET mungon në .env");
    return new Response("Server misconfigured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Raw body është i domosdoshëm për verifikimin e nënshkrimit nga svix
  const rawBody = await req.text();

  let evt: WebhookEvent;
  try {
    evt = new Webhook(secret).verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Verifikimi i webhook-ut dështoi:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type: eventType, data } = evt;
  console.log(`[Clerk Webhook] ${eventType}`);

  switch (eventType) {
    case "user.created":
    case "user.updated": {
      const email = data.email_addresses?.[0]?.email_address;
      if (!email) return new Response("Missing email", { status: 400 });

      const name =
        [data.first_name, data.last_name].filter(Boolean).join(" ") ||
        "Përdorues UTC Kids";

      const role = resolveRole(email);

      await prisma.user.upsert({
        where: { id: data.id },
        update: { clerkId: data.id, name, email, role },
        create: { id: data.id, clerkId: data.id, name, email, role },
      });

      console.log(`[Clerk Webhook] User upserted: ${data.id}`);
      break;
    }

    case "user.deleted": {
      if (data.id) {
        await prisma.user.deleteMany({ where: { id: data.id } });
        console.log(`[Clerk Webhook] User deleted: ${data.id}`);
      }
      break;
    }

    default:
      console.log(`[Clerk Webhook] Event i patrajtuar: ${eventType}`);
  }

  return NextResponse.json({ success: true });
}
