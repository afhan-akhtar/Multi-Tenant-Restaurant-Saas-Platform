import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";
import { provisionTenantDatabaseAndMigrate } from "@/lib/provision-tenant-database";
import { ensureTenantOnboardingSubscription } from "@/lib/subscriptions";

// PATCH /api/super-admin/tenants/[id] - Update tenant status (approve, block, unblock)
export async function PATCH(req, { params }) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token || token.type !== "super_admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params?.id ?? "", 10);
    if (!id) {
      return NextResponse.json({ error: "Invalid tenant ID" }, { status: 400 });
    }

    const body = await req.json();
    const { action } = body; // "approve" | "block" | "unblock"

    if (!["approve", "block", "unblock"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const tenant = await platformPrisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    let newStatus;
    if (action === "approve") {
      if (tenant.status !== "PENDING") {
        return NextResponse.json({ error: "Only pending tenants can be approved." }, { status: 400 });
      }
      newStatus = "ACTIVE";
    } else if (action === "block") {
      if (tenant.status === "BLOCKED") {
        return NextResponse.json({ error: "Tenant is already blocked." }, { status: 400 });
      }
      newStatus = "BLOCKED";
    } else {
      if (tenant.status !== "BLOCKED") {
        return NextResponse.json({ error: "Only blocked tenants can be unblocked." }, { status: 400 });
      }
      newStatus = "ACTIVE";
    }

    if (!tenant.databaseUrl?.trim() && (action === "approve" || action === "unblock")) {
      try {
        await provisionTenantDatabaseAndMigrate(id);
      } catch (e) {
        console.error("[super-admin approve] provision failed", e);
        return NextResponse.json(
          { error: "Could not provision tenant database. Check logs and DATABASE_ADMIN_URL." },
          { status: 500 }
        );
      }
    }

    await platformPrisma.tenant.update({
      where: { id },
      data: { status: newStatus },
    });

    const after = await platformPrisma.tenant.findUnique({
      where: { id },
      select: { databaseUrl: true },
    });
    if (after?.databaseUrl?.trim()) {
      try {
        const tp = await getTenantPrisma(id);
        await tp.tenant.update({
          where: { id },
          data: { status: newStatus },
        });
      } catch (e) {
        console.error("[super-admin tenants] tenant DB status sync", e);
      }
    }

    if (action === "approve" || action === "unblock") {
      await ensureTenantOnboardingSubscription(platformPrisma, id);
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
    });
  } catch (err) {
    console.error("[super-admin tenants update]", err);
    return NextResponse.json({ error: "Failed to update tenant." }, { status: 500 });
  }
}
