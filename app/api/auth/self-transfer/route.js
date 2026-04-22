import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { buildTenantUrl } from "@/lib/tenant-url";

/**
 * POST /api/auth/self-transfer
 *
 * Generates a short-lived one-time impersonation token for the currently
 * logged-in restaurant staff member and returns the subdomain login URL
 * that will consume it.  Used by the root login form to hand off the
 * session to the correct subdomain so the cookie is set on the right domain.
 */
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || token.type !== "staff") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffId = Number(token.id);
    const tenantId = Number(token.tenantId);
    const subdomain = token.subdomain;

    if (!staffId || !tenantId || !subdomain) {
      return NextResponse.json({ error: "Incomplete session data." }, { status: 400 });
    }

    const payload = JSON.stringify({
      staffId,
      tenantId,
      exp: Date.now() + 2 * 60 * 1000, // 2-minute window
    });
    const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
    const sig = crypto
      .createHmac("sha256", process.env.NEXTAUTH_SECRET)
      .update(payload)
      .digest("base64url");
    const otp = `${payloadB64}.${sig}`;

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";

    const loginUrl = new URL(buildTenantUrl({ host, protocol, subdomain, pathname: "/login" }));
    loginUrl.searchParams.set("impersonateToken", otp);

    return NextResponse.json({ redirectUrl: loginUrl.toString() });
  } catch (err) {
    console.error("[self-transfer]", err);
    return NextResponse.json({ error: "Transfer failed." }, { status: 500 });
  }
}
