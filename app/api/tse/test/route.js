import { signTransaction } from "@/lib/tse";
import { NextResponse } from "next/server";

/**
 * Test Fiskaly TSE connectivity.
 * GET /api/tse/test - returns auth & optional transaction test result.
 * Use this to verify Fiskaly is working before testing POS checkout.
 */
export async function GET() {
  const result = { ok: false, auth: null, transaction: null, error: null };

  if (!process.env.FISKALY_API_KEY || !process.env.FISKALY_API_SECRET) {
    result.error = "401 Missing credentials";
    return NextResponse.json(result, { status: 401 });
  }

  try {
    const txResult = await signTransaction({
      type: "SALE",
      tenantId: null,
      orderNumber: "TEST-" + Date.now(),
      amount: 0.01,
      fn: "Test",
    });
    result.ok = true;
    result.auth = "OK";
    const sig = txResult.signature;
    result.transaction = {
      transactionId: txResult.transactionId,
      signature: typeof sig === "string" ? sig.slice(0, 48) + "…" : String(sig || "").slice(0, 48) + "…",
    };
  } catch (err) {
    result.error = err?.message || String(err);
    result.auth = result.error.includes("auth") ? "FAILED" : "OK (auth worked)";
  }

  return NextResponse.json(result);
}
