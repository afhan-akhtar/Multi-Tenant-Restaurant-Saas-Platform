import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { getTenantPrisma } from "@/lib/tenant-db";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });
    const prisma = await getTenantPrisma(tenantId);

    const body = await req.json();
    const { name, minSelect, maxSelect } = body;
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const min = Math.max(0, parseInt(minSelect, 10) || 0);
    const max = Math.max(min, parseInt(maxSelect, 10) || 1);

    const group = await prisma.addonGroup.create({
      data: {
        tenantId,
        name: name.trim(),
        minSelect: min,
        maxSelect: max,
      },
    });
    return NextResponse.json({ success: true, group: { id: group.id, name: group.name } });
  } catch (err) {
    console.error("[addons POST]", err);
    return NextResponse.json({ error: "Failed to create add-on group" }, { status: 500 });
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

    const existing = await prisma.addonGroup.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: "Add-on group not found" }, { status: 404 });

    await prisma.addonGroup.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[addons DELETE]", err);
    return NextResponse.json({ error: "Failed to delete add-on group" }, { status: 500 });
  }
}
