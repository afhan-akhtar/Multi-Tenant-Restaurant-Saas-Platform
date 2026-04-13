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
    const { name, parentId } = body;
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const category = await prisma.category.create({
      data: {
        tenantId,
        name: name.trim(),
        parentId: parentId ? parseInt(parentId, 10) : null,
      },
    });
    return NextResponse.json({ success: true, category: { id: category.id, name: category.name } });
  } catch (err) {
    console.error("[categories POST]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
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

    const existing = await prisma.category.findFirst({ where: { id, tenantId }, include: { _count: { select: { products: true } } } });
    if (!existing) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    if (existing._count.products > 0) return NextResponse.json({ error: "Cannot delete category with products. Remove products first." }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[categories DELETE]", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
