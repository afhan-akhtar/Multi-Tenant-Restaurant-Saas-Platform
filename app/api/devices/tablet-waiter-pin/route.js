import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";
import { requireTenantStaffActor } from "@/lib/devices";
import { hashPassword } from "@/lib/password";
import { assertTenantFeatureAccess, getTenantSubscriptionAccess } from "@/lib/subscriptions";

function hasTabletFeature(access) {
  if (!access?.hasSubscription || access.isBlocked) {
    return false;
  }
  return access.featureCodes.includes("TABLET");
}

export async function GET(request) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await getTenantSubscriptionAccess(actor.tenantId);
    const tabletFeatureAvailable = hasTabletFeature(access);

    const prisma = await getTenantPrisma(actor.tenantId);
    const tenant = await prisma.tenant.findUnique({
      where: { id: actor.tenantId },
      select: { tabletSettings: true },
    });

    const settings =
      tenant?.tabletSettings && typeof tenant.tabletSettings === "object" ? tenant.tabletSettings : {};
    const configured = Boolean(settings.waiterPinHash && typeof settings.waiterPinHash === "string");

    return NextResponse.json({
      tabletFeatureAvailable,
      configured,
    });
  } catch (error) {
    console.error("[devices tablet-waiter-pin GET]", error);
    return NextResponse.json({ error: "Failed to load waiter PIN status" }, { status: 500 });
  }
}

const PIN_PATTERN = /^\d{4,12}$/;

export async function PATCH(request) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const featureAccess = await assertTenantFeatureAccess(actor.tenantId, "TABLET");
    if (!featureAccess.ok) {
      return NextResponse.json({ error: featureAccess.error }, { status: featureAccess.status });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const body = await request.json().catch(() => ({}));
    const clear = Boolean(body?.clear);

    const tenant = await prisma.tenant.findUnique({
      where: { id: actor.tenantId },
      select: { tabletSettings: true },
    });

    const prev = tenant?.tabletSettings && typeof tenant.tabletSettings === "object" ? { ...tenant.tabletSettings } : {};

    if (clear) {
      delete prev.waiterPinHash;
      await prisma.tenant.update({
        where: { id: actor.tenantId },
        data: { tabletSettings: prev },
      });
      return NextResponse.json({ success: true, configured: false });
    }

    const pin = String(body?.pin ?? "").trim();
    if (!PIN_PATTERN.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be 4–12 digits." },
        { status: 400 }
      );
    }

    const waiterPinHash = await hashPassword(pin);
    await prisma.tenant.update({
      where: { id: actor.tenantId },
      data: {
        tabletSettings: {
          ...prev,
          waiterPinHash,
        },
      },
    });

    return NextResponse.json({ success: true, configured: true });
  } catch (error) {
    console.error("[devices tablet-waiter-pin PATCH]", error);
    return NextResponse.json({ error: "Failed to save waiter PIN" }, { status: 500 });
  }
}
