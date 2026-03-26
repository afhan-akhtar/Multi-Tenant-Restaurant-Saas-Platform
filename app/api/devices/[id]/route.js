import { NextResponse } from "next/server";
import {
  ensureTenantBranch,
  ensureTenantKdsScreen,
  getDefaultKdsScreen,
  requireTenantStaffActor,
  serializeDeviceToken,
} from "@/lib/devices";
import { prisma } from "@/lib/db";

function parseId(value) {
  const id = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function loadTenantDevice(tenantId, id) {
  return prisma.deviceToken.findFirst({
    where: { id, tenantId },
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
}

export async function PATCH(request, { params }) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    const existing = await loadTenantDevice(actor.tenantId, id);
    if (!existing) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const body = await request.json();
    const nextName = typeof body?.name === "string" ? body.name.trim() : existing.name;
    const nextStatus = typeof body?.status === "string" ? body.status.toUpperCase() : existing.status;
    const nextBranchId = body?.branchId ? Number(body.branchId) : existing.branchId;
    const nextScreenId =
      body?.screenId === null
        ? null
        : body?.screenId
        ? Number(body.screenId)
        : existing.screenId ?? null;

    if (!nextName) {
      return NextResponse.json({ error: "Device name is required" }, { status: 400 });
    }

    if (!["ACTIVE", "DISABLED"].includes(nextStatus)) {
      return NextResponse.json({ error: "Invalid device status" }, { status: 400 });
    }

    const branch = nextBranchId ? await ensureTenantBranch(actor.tenantId, nextBranchId) : null;
    if (nextBranchId && !branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    let screen = null;
    if (existing.deviceType === "KDS") {
      const branchIdForScreen = branch?.id ?? existing.branchId ?? null;
      screen =
        (nextScreenId ? await ensureTenantKdsScreen(actor.tenantId, nextScreenId, branchIdForScreen) : null) ||
        (nextScreenId === null ? null : await getDefaultKdsScreen(branchIdForScreen));
    }

    const device = await prisma.deviceToken.update({
      where: { id: existing.id },
      data: {
        name: nextName,
        status: nextStatus,
        branchId: branch?.id ?? existing.branchId ?? null,
        screenId: existing.deviceType === "KDS" ? screen?.id ?? null : null,
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

    return NextResponse.json({ device: serializeDeviceToken(device) });
  } catch (error) {
    console.error("[devices PATCH]", error);
    const status = error?.code === "P2002" ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A device with this name already exists." : "Failed to update device" },
      { status }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    const existing = await prisma.deviceToken.findFirst({
      where: { id, tenantId: actor.tenantId },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    await prisma.deviceToken.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[devices DELETE]", error);
    return NextResponse.json({ error: "Failed to delete device" }, { status: 500 });
  }
}
