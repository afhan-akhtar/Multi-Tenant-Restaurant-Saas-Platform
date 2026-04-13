import { NextResponse } from "next/server";
import {
  ensureTenantBranch,
  getTenantKdsScreens,
  requireTenantStaffActor,
  serializeKdsScreen,
} from "@/lib/devices";
import { getTenantPrisma } from "@/lib/tenant-db";

const ALLOWED_STATION_TYPES = ["MAIN", "EXPEDITOR", "GRILL", "FRYER", "DRINKS", "PACKING", "DESSERT", "CUSTOM"];

export async function GET(request) {
  try {
    const actor = await requireTenantStaffActor(request);
    if (!actor?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const screens = await getTenantKdsScreens(actor.tenantId);
    return NextResponse.json({ screens: screens.map(serializeKdsScreen) });
  } catch (error) {
    console.error("[kds screens GET]", error);
    return NextResponse.json({ error: "Failed to load KDS screens" }, { status: 500 });
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
    const branchId = body?.branchId ? Number(body.branchId) : null;
    const code = String(body?.code || "").trim();
    const stationType = String(body?.stationType || "MAIN").toUpperCase();
    const isDefault = Boolean(body?.isDefault);

    if (!name) {
      return NextResponse.json({ error: "Screen name is required" }, { status: 400 });
    }

    if (!branchId) {
      return NextResponse.json({ error: "Branch is required" }, { status: 400 });
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
          where: { branchId: branch.id },
          data: { isDefault: false },
        });
      }

      return tx.kDSScreen.create({
        data: {
          branchId: branch.id,
          name,
          code: code || null,
          stationType,
          isActive: true,
          isDefault,
        },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
            },
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
    console.error("[kds screens POST]", error);
    const status = error?.code === "P2002" ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? "A screen with this name already exists for the branch." : "Failed to create KDS screen" },
      { status }
    );
  }
}
