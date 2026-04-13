import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { assignSubscriptionToTenant, serializeSubscription } from "@/lib/subscriptions";

// POST /api/admin/subscriptions - Assign plan to tenant (Super Admin only)
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
    const tenantId = Number(body?.tenantId);
    const planId = Number(body?.planId);

    if (!tenantId || !planId) {
      return NextResponse.json(
        { error: "Tenant and plan are required." },
        { status: 400 }
      );
    }

    const tenant = await platformPrisma.tenant.findUnique({ where: { id: tenantId } });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found." }, { status: 404 });
    }
    if (tenant.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Only active tenants can be assigned a subscription." },
        { status: 400 }
      );
    }

    const sub = await platformPrisma.$transaction((tx) =>
      assignSubscriptionToTenant(tx, {
        tenantId: tenant.id,
        planId,
      })
    );
    const serialized = serializeSubscription(sub);

    return NextResponse.json({
      success: true,
      subscription: serialized,
    });
  } catch (err) {
    console.error("[admin subscriptions create]", err);
    return NextResponse.json({ error: "Failed to create subscription." }, { status: 500 });
  }
}
