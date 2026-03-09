import { NextResponse } from "next/server";
import { setupFiskalyTSS } from "@/lib/tse/fiskalySetup";
import { prisma } from "@/lib/db";

/**
 * POST /api/tse/setup
 * Provisions TSS + client using only Fiskaly API key + secret.
 * Body: { apiKey, apiSecret, tenantId?, serialNumber? }
 *
 * If tenantId is provided, saves config to TenantFiskalyConfig.
 * Returns: { tssId, clientId, adminPuk, adminPin?, saved: boolean }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { apiKey, apiSecret, tenantId, serialNumber } = body || {};

    const key = apiKey || process.env.FISKALY_API_KEY;
    const secret = apiSecret || process.env.FISKALY_API_SECRET;

    if (!key || !secret) {
      return NextResponse.json({ error: "400 Missing credentials" }, { status: 400 });
    }

    const result = await setupFiskalyTSS(key, secret, { serialNumber: serialNumber || "pos-1" });

    if (tenantId) {
      await prisma.tenantFiskalyConfig.upsert({
        where: { tenantId: Number(tenantId) },
        create: {
          tenantId: Number(tenantId),
          apiKey: key,
          apiSecret: secret,
          tssId: result.tssId,
          clientId: result.clientId,
          adminPuk: result.adminPuk || null,
        },
        update: {
          apiKey: key,
          apiSecret: secret,
          tssId: result.tssId,
          clientId: result.clientId,
          adminPuk: result.adminPuk || undefined,
        },
      });
    } else {
      await prisma.fiskalyPlatformConfig.upsert({
        where: { apiKey: key },
        create: {
          apiKey: key,
          tssId: result.tssId,
          clientId: result.clientId,
          adminPuk: result.adminPuk || null,
        },
        update: {
          tssId: result.tssId,
          clientId: result.clientId,
          adminPuk: result.adminPuk || undefined,
        },
      });
    }

    return NextResponse.json({
      ...result,
      saved: !!tenantId,
      // Don't expose adminPin in response if not needed
      adminPin: result.adminPin ? "<set>" : undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
