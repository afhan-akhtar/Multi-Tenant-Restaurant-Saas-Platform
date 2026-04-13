import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { runSubscriptionBillingCycle } from "@/lib/subscriptions";

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await runSubscriptionBillingCycle(platformPrisma);

    return NextResponse.json({
      success: true,
      processed: subscriptions.length,
    });
  } catch (error) {
    console.error("[admin subscriptions billing cycle]", error);
    return NextResponse.json({ error: "Failed to process billing cycle." }, { status: 500 });
  }
}
