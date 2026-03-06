import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import { recordWithdrawal } from "@/lib/cashbook";
import { signAndStoreCashbook } from "@/lib/tse/db";
import { TSE_TYPES } from "@/lib/tse/db";
import { NextResponse } from "next/server";

/**
 * Record a cash withdrawal. Immutable, TSE-signed.
 */
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
    if (!tenantId) {
      return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    }

    const body = await request.json();
    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid amount required" }, { status: 400 });
    }

    const entry = await recordWithdrawal(tenantId, amount);
    await signAndStoreCashbook(tenantId, entry.id, TSE_TYPES.CASH_WITHDRAWAL, amount);

    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    console.error("[cashbook withdrawal]", err);
    return NextResponse.json({ error: err.message || "Withdrawal failed" }, { status: 500 });
  }
}
