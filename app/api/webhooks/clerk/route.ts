import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Habit } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error(
      "CLERK_WEBHOOK_SIGNING_SECRET is not set in environment variables."
    );
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred verifying webhook", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  if (eventType === "user.deleted") {
    if (!id) {
      console.error("User ID missing in user.deleted event payload");
      return new NextResponse("User ID missing", { status: 400 });
    }

    try {
      console.log(`Processing user.deleted event for userId: ${id}`);
      const deletedHabits = await db
        .delete(Habit)
        .where(eq(Habit.userId, id))
        .returning({ id: Habit.id });

      console.log(
        `Deleted ${deletedHabits.length} habits (and their completions) for user ${id}`
      );
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error(`Error deleting data for user ${id}:`, error);
      return new NextResponse("Error processing user deletion data", {
        status: 500,
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
