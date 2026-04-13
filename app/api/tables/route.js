import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    const branchId = token.branchId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const body = await req.json();
    const { name, seats, branchId: bodyBranchId } = body;
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    let bid = bodyBranchId ? parseInt(bodyBranchId, 10) : branchId;
    if (!bid) {
      const branch = await prisma.branch.findFirst({ where: { tenantId } });
      if (!branch) return NextResponse.json({ error: "No branch found" }, { status: 400 });
      bid = branch.id;
    }
    const branch = await prisma.branch.findFirst({ where: { id: bid, tenantId } });
    if (!branch) return NextResponse.json({ error: "Invalid branch" }, { status: 400 });

    const seatsNum = parseInt(seats, 10) || 2;

    const table = await prisma.diningTable.create({
      data: {
        tenantId,
        branchId: bid,
        name: name.trim(),
        seats: seatsNum,
        status: "AVAILABLE",
      },
    });
    return NextResponse.json({ success: true, table: { id: table.id, name: table.name } });
  } catch (err) {
    console.error("[tables POST]", err);
    return NextResponse.json({ error: "Failed to create table" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"), 10);
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.diningTable.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: "Table not found" }, { status: 404 });

    await prisma.diningTable.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[tables DELETE]", err);
    return NextResponse.json({ error: "Failed to delete table" }, { status: 500 });
  }
}
