import { NextResponse } from "next/server";
import { sendDueFollowUps, sendDueReviewRequests } from "@/lib/offerte-mails";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Dagelijks aangeroepen door Vercel Cron (zie vercel.json): opvolging van offertes en reviewverzoeken.
 * Vercel stuurt `Authorization: Bearer $CRON_SECRET` mee. Er worden pas echte mails verstuurd met
 * `OFFERTE_MAILS=on`; anders telt de taak alleen hoeveel er zouden gaan (dryRun).
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Niet toegestaan." }, { status: 401 });
  }

  const dryRun = process.env.OFFERTE_MAILS !== "on";
  const opvolging = await sendDueFollowUps({ dryRun });
  const reviews = await sendDueReviewRequests({ dryRun });
  return NextResponse.json({ dryRun, opvolging, reviews });
}
