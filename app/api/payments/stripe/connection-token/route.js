import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { createStripeTerminalConnectionToken } from "@/lib/payments/stripe";

export async function POST(request) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = token.tenantId ?? null;
    const branchId = token.branchId ?? null;

    if (!tenantId || !branchId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const connectionToken = await createStripeTerminalConnectionToken();
    return NextResponse.json({ secret: connectionToken.secret });
  } catch (error) {
    console.error("[stripe connection-token]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe Terminal connection token." },
      { status: 500 }
    );
  }
}
