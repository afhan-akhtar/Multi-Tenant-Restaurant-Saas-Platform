import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// POST /api/admin/impersonate - Generate impersonation token (Super Admin only)
export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { staffId } = body;

    if (!staffId) {
      return NextResponse.json({ error: "Tenant admin ID required." }, { status: 400 });
    }

    const staff = await prisma.tenantAdmin.findUnique({
      where: { id: Number(staffId), status: "ACTIVE" },
      include: { role: true, tenant: true },
    });

    if (!staff || staff.tenant?.status !== "ACTIVE") {
      return NextResponse.json({ error: "Tenant admin not found or tenant inactive." }, { status: 404 });
    }

    const payload = JSON.stringify({
      staffId: staff.id,
      exp: Date.now() + 5 * 60 * 1000,
    });
    const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
    const sig = crypto
      .createHmac("sha256", process.env.NEXTAUTH_SECRET)
      .update(payload)
      .digest("base64url");
    const impersonateToken = payloadB64 + "." + sig;

    return NextResponse.json({
      success: true,
      token: impersonateToken,
      redirectUrl: `/${staff.tenant?.subdomain || "demo"}`,
    });
  } catch (err) {
    console.error("[admin impersonate]", err);
    return NextResponse.json({ error: "Impersonation failed." }, { status: 500 });
  }
}
