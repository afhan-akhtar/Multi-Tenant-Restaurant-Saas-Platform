import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    const tenant = await prisma.tenant.findUnique({ where: { id } });
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
      // unblock
      if (tenant.status !== "BLOCKED") {
        return NextResponse.json({ error: "Only blocked tenants can be unblocked." }, { status: 400 });
      }
      newStatus = "ACTIVE";
    }

    await prisma.tenant.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      success: true,
      status: newStatus,
    });
  } catch (err) {
    console.error("[super-admin tenants update]", err);
    return NextResponse.json({ error: "Failed to update tenant." }, { status: 500 });
  }
}
