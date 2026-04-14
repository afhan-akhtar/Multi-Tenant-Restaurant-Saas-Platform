import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { escposCashDrawerPulse } from "@/lib/pos-hardware/escpos-format";
import { forwardToPosAgent } from "@/lib/pos-hardware/agent-request";
import { normalizePosHardwareSettings, publicPosHardwareSettings } from "@/lib/pos-hardware/settings";

export const dynamic = "force-dynamic";

function parseTenantId(body) {
  const v = body?.tenant_id ?? body?.tenantId;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function POST(request) {
  try {
    const actor = await getRequestActor(request, { allowedDeviceTypes: ["POS", "TABLET"] });
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const tenantId = parseTenantId(body);
    if (!tenantId || tenantId !== actor.tenantId) {
      return NextResponse.json({ error: "tenant_id must match authenticated tenant" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantId);
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { posHardwareSettings: true },
    });

    const raw = tenant?.posHardwareSettings;
    const normalized = normalizePosHardwareSettings(raw);
    const pulse = escposCashDrawerPulse(normalized.drawer.pin);

    const agentBody = {
      tenant_id: tenantId,
      job: "drawer",
      payload_base64: pulse.toString("base64"),
      printer: normalized.printer,
    };

    const forward = await forwardToPosAgent("/drawer", agentBody, raw);
    const pub = publicPosHardwareSettings(raw);

    return NextResponse.json({
      success: forward.ok,
      agentReached: forward.agentReached,
      error: forward.ok ? null : forward.error,
      clientBridge:
        forward.ok && forward.agentReached
          ? null
          : {
              url: `${pub.localAgentBaseUrl}/drawer`,
              body: agentBody,
            },
    });
  } catch (e) {
    console.error("[open-drawer]", e);
    return NextResponse.json({ error: e?.message || "Drawer command failed" }, { status: 500 });
  }
}
