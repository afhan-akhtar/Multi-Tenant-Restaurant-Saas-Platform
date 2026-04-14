import { NextResponse } from "next/server";
import { getRequestActor } from "@/lib/device-auth";
import { getTenantPrisma } from "@/lib/tenant-db";
import { formatReceiptEscPos } from "@/lib/pos-hardware/escpos-format";
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

    const receipt = body.receipt;
    if (!receipt || typeof receipt !== "object") {
      return NextResponse.json({ error: "receipt object is required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(tenantId);
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { posHardwareSettings: true },
    });

    const raw = tenant?.posHardwareSettings;
    const normalized = normalizePosHardwareSettings(raw);
    const escpos = formatReceiptEscPos(receipt);

    const agentBody = {
      tenant_id: tenantId,
      job: "print",
      payload_base64: escpos.toString("base64"),
      printer: normalized.printer,
    };

    const forward = await forwardToPosAgent("/print", agentBody, raw);
    const pub = publicPosHardwareSettings(raw);

    return NextResponse.json({
      success: forward.ok,
      agentReached: forward.agentReached,
      error: forward.ok ? null : forward.error,
      clientBridge:
        forward.ok && forward.agentReached
          ? null
          : {
              url: `${pub.localAgentBaseUrl}/print`,
              body: agentBody,
            },
    });
  } catch (e) {
    console.error("[print-receipt]", e);
    return NextResponse.json({ error: e?.message || "Print request failed" }, { status: 500 });
  }
}
