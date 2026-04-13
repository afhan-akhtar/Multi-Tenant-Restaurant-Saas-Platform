import { NextResponse } from "next/server";
import {
  requireTenantStaffActor,
  serializeDeviceToken,
} from "@/lib/devices";
import {
  generateDeviceTokenValue,
  getAbsoluteDeviceUrl,
  hashDeviceToken,
} from "@/lib/device-auth";
import { getTenantPrisma } from "@/lib/tenant-db";

function parseId(value) {
  const id = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function POST(request, { params }) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const existing = await prisma.deviceToken.findFirst({
      where: {
        id,
        tenantId: actor.tenantId,
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        screen: {
          select: {
            id: true,
            name: true,
            stationType: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const rawToken = generateDeviceTokenValue();

    const device = await prisma.deviceToken.update({
      where: { id: existing.id },
      data: {
        tokenHash: hashDeviceToken(rawToken),
        status: "ACTIVE",
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
        screen: {
          select: {
            id: true,
            name: true,
            stationType: true,
          },
        },
      },
    });

    return NextResponse.json({
      device: serializeDeviceToken(device),
      token: rawToken,
      deviceUrl: getAbsoluteDeviceUrl(request, {
        tenantId: device.tenantId,
        deviceType: device.deviceType,
        token: rawToken,
      }),
    });
  } catch (error) {
    console.error("[devices regenerate]", error);
    return NextResponse.json({ error: "Failed to regenerate device token" }, { status: 500 });
  }
}
