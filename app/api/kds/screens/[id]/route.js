import { NextResponse } from "next/server";
import {
  ensureTenantBranch,
  requireTenantStaffActor,
  serializeKdsScreen,
} from "@/lib/devices";
import { getTenantPrisma } from "@/lib/tenant-db";

const ALLOWED_STATION_TYPES = ["MAIN", "EXPEDITOR", "GRILL", "FRYER", "DRINKS", "PACKING", "DESSERT", "CUSTOM"];

function parseId(value) {
  const id = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request, { params }) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId(params?.id);
    if (!id) {
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const existing = await prisma.kDSScreen.findFirst({
      where: {
        id,
        branch: { tenantId: actor.tenantId },
      },
      include: {
        branch: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            deviceTokens: true,
            kdsItems: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : existing.name;
    const branchId = body?.branchId ? Number(body.branchId) : existing.branchId;
    const code = typeof body?.code === "string" ? body.code.trim() : existing.code || "";
    const stationType = typeof body?.stationType === "string" ? body.stationType.toUpperCase() : existing.stationType;
    const isDefault = typeof body?.isDefault === "boolean" ? body.isDefault : existing.isDefault;
    const isActive = typeof body?.isActive === "boolean" ? body.isActive : existing.isActive;

    if (!name) {
      return NextResponse.json({ error: "Screen name is required" }, { status: 400 });
    }

    if (!ALLOWED_STATION_TYPES.includes(stationType)) {
      return NextResponse.json({ error: "Invalid station type" }, { status: 400 });
    }

    const branch = await ensureTenantBranch(actor.tenantId, branchId);
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const screen = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.kDSScreen.updateMany({
          where: {
            branchId: branch.id,
            id: { not: existing.id },
          },
          data: { isDefault: false },
        });
      }

      return tx.kDSScreen.update({
        where: { id: existing.id },
        data: {
          branchId: branch.id,
          name,
          code: code || null,
          stationType,
          isDefault,
          isActive,
        },
        include: {
          branch: {
            select: { id: true, name: true },
          },
          _count: {
            select: {
              deviceTokens: true,
              kdsItems: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ screen: serializeKdsScreen(screen) });
  } catch (error) {
    console.error("[kds screens PATCH]", error);
    const status = error?.code === "P2002" ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A screen with this name already exists for the branch." : "Failed to update KDS screen" },
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
      return NextResponse.json({ error: "Screen ID is required" }, { status: 400 });
    }

    const prisma = await getTenantPrisma(actor.tenantId);
    const existing = await prisma.kDSScreen.findFirst({
      where: {
        id,
        branch: { tenantId: actor.tenantId },
      },
      include: {
        _count: {
          select: {
            deviceTokens: true,
            kdsItems: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Screen not found" }, { status: 404 });
    }

    if (existing._count.kdsItems > 0) {
      return NextResponse.json(
        { error: "This screen has order history and cannot be deleted. Disable it instead." },
        { status: 400 }
      );
    }

    await prisma.kDSScreen.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[kds screens DELETE]", error);
    return NextResponse.json({ error: "Failed to delete KDS screen" }, { status: 500 });
  }
}
