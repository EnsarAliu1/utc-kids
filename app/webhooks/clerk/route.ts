import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Mungojnë header-at e svix.");
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  let payload: any;
  try {
    payload = await req.json();
  } catch (err) {
    console.error("Gabim gjatë parse të JSON-it të body:", err);
    return new Response("Invalid JSON", { status: 400 });
  }
  const body = JSON.stringify(payload);

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn("CLERK_WEBHOOK_SECRET nuk është i vendosur në .env. Duke anashkaluar verifikimin e nënshkrimit për qëllime testimi.");
  } else {
    // Verifiko nënshkrimin me svix
    const wh = new Webhook(webhookSecret);
    try {
      wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Gabim në verifikimin e nënshkrimit nga Clerk:", err);
      return new Response("Error occurred -- signature verification failed", {
        status: 400,
      });
    }
  }

  // Pasi verifikimi kalon ose anashkalohet në dev:
  const evt = payload as WebhookEvent;
  const eventType = evt.type;
  console.log(`Clerk Webhook thirrur me event: ${eventType}`);

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    if (!id) {
      return new Response("Mungon ID e përdoruesit", { status: 400 });
    }

    const email = email_addresses && email_addresses[0]?.email_address;
    if (!email) {
      return new Response("Mungon emaili i përdoruesit", { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || "Përdorues i UTC Kids";

    try {
      await prisma.user.upsert({
        where: { id: id },
        update: {
          clerkId: id,
          name: name,
          email: email,
        },
        create: {
          id: id,
          clerkId: id,
          name: name,
          email: email,
          role: "STUDENT", // default role
        },
      });
      console.log(`Përdoruesi me ID ${id} u përditësua/krijua në databazë me sukses.`);
    } catch (dbErr) {
      console.error("Gabim gjatë sinkronizimit të përdoruesit në DB:", dbErr);
      return new Response("Database error during user upsert", { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
