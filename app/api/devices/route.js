import { NextResponse } from "next/server";
import { generateDeviceTokenValue, getAbsoluteDeviceUrl, hashDeviceToken } from "@/lib/device-auth";
import {
  ensureTenantBranch,
  ensureTenantKdsScreen,
  getDefaultKdsScreen,
  getDefaultTenantBranch,
  getTenantDeviceTokens,
  requireTenantStaffActor,
  serializeDeviceToken,
} from "@/lib/devices";
import { getTenantPrisma } from "@/lib/tenant-db";

export async function GET(request) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const devices = await getTenantDeviceTokens(actor.tenantId);
    return NextResponse.json({ devices: devices.map(serializeDeviceToken) });
  } catch (error) {
    console.error("[devices GET]", error);
    return NextResponse.json({ error: "Failed to load devices" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body?.name || "").trim();
    const deviceType = String(body?.deviceType || "").toUpperCase();
    const requestedBranchId = body?.branchId ? Number(body.branchId) : null;
    const requestedScreenId = body?.screenId ? Number(body.screenId) : null;

    if (!name) {
      return NextResponse.json({ error: "Device name is required" }, { status: 400 });
    }

    if (!["POS", "KDS", "TABLET"].includes(deviceType)) {
      return NextResponse.json({ error: "Invalid device type" }, { status: 400 });
    }

    const branch =
      (requestedBranchId ? await ensureTenantBranch(actor.tenantId, requestedBranchId) : null) ||
      (await getDefaultTenantBranch(actor.tenantId));

    if (!branch) {
      return NextResponse.json({ error: "Create a branch before adding devices" }, { status: 400 });
    }

    let screen = null;
    if (deviceType === "KDS") {
      screen =
        (requestedScreenId ? await ensureTenantKdsScreen(actor.tenantId, requestedScreenId, branch.id) : null) ||
        (await getDefaultKdsScreen(actor.tenantId, branch.id));
    }

    const rawToken = generateDeviceTokenValue();

    const prisma = await getTenantPrisma(actor.tenantId);
    const device = await prisma.deviceToken.create({
      data: {
        tenantId: actor.tenantId,
        branchId: branch.id,
        screenId: deviceType === "KDS" ? screen?.id ?? null : null,
        name,
        deviceType,
        status: "ACTIVE",
        tokenHash: hashDeviceToken(rawToken),
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
        tenantId: actor.tenantId,
        deviceType,
        token: rawToken,
      }),
    });
  } catch (error) {
    console.error("[devices POST]", error);
    const status = error?.code === "P2002" ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A device with this name already exists." : "Failed to create device" },
      { status }
    );
  }
}
