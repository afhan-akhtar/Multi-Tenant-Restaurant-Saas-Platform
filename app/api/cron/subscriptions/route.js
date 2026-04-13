import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { runSubscriptionBillingCycle } from "@/lib/subscriptions";

/**
 * Cron entrypoint for subscription lifecycle processing.
 * Suitable for Vercel cron or any scheduler that periodically calls this route.
 */
export async function GET() {
  try {
    const subscriptions = await runSubscriptionBillingCycle(platformPrisma);
    return NextResponse.json({ ok: true, processed: subscriptions.length });
  } catch (error) {
    console.error("[subscription billing cron]", error);
    return NextResponse.json(
      { error: error.message || "Subscription billing cycle failed." },
      { status: 500 }
    );
  }
}
