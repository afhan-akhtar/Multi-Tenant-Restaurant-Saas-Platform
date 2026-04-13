import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import { normalizeLoyaltySettings, DEFAULT_LOYALTY_SETTINGS } from "@/lib/loyalty";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

async function resolveTenantId(request) {
  const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS"] });
  if (actor?.tenantId) return actor.tenantId;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  return token?.tenantId ?? null;
}

export async function GET(request) {
  try {
    const tenantId = await resolveTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loyaltyAccess = await assertTenantFeatureAccess(tenantId, "LOYALTY");
    const prisma = await getTenantPrisma(tenantId);
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { loyaltySettings: true },
    });
    const settings = normalizeLoyaltySettings(tenant?.loyaltySettings);

    return NextResponse.json({
      enabled: loyaltyAccess.ok,
      settings,
      defaults: DEFAULT_LOYALTY_SETTINGS,
    });
  } catch (err) {
    console.error("[loyalty settings GET]", err);
    return NextResponse.json({ error: "Failed to load loyalty settings" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const loyaltyAccess = await assertTenantFeatureAccess(tenantId, "LOYALTY");
    if (!loyaltyAccess.ok) {
      return NextResponse.json({ error: loyaltyAccess.error }, { status: loyaltyAccess.status });
    }

    const body = await request.json().catch(() => ({}));
    const existing = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { loyaltySettings: true },
    });
    const settings = normalizeLoyaltySettings({
      ...normalizeLoyaltySettings(existing?.loyaltySettings),
      ...body,
    });

    await prisma.tenant.update({
      where: { id: tenantId },
      data: { loyaltySettings: settings },
    });

    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("[loyalty settings PATCH]", err);
    return NextResponse.json({ error: "Failed to save loyalty settings" }, { status: 500 });
  }
}
