import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getRequestActor } from "@/lib/device-auth";
import { assertTenantFeatureAccess } from "@/lib/subscriptions";

const MAX_TOKENS = 20;

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const featureAccess = await assertTenantFeatureAccess(actor.tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const body = await request.json();
    const token = String(body?.token || "").trim();
    if (!token) {
      return NextResponse.json({ error: "token required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const tenant = await prisma.tenant.findUnique({
      where: { id: actor.tenantId },
      select: { tabletSettings: true },
    });

    const prev = tenant?.tabletSettings && typeof tenant.tabletSettings === "object" ? tenant.tabletSettings : {};
    const list = Array.isArray(prev.fcmTokens) ? [...prev.fcmTokens] : [];
    if (!list.includes(token)) {
      list.push(token);
    }
    const fcmTokens = list.slice(-MAX_TOKENS);

    await prisma.tenant.update({
      where: { id: actor.tenantId },
      data: {
        tabletSettings: {
          ...prev,
          fcmTokens,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[tablet fcm register]", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
