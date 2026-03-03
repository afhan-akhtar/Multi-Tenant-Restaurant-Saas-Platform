import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });

    const body = await req.json();
    const { name, description, plu, basePrice, taxRate, categoryId, imageUrl } = body;
    if (!name?.trim() || !categoryId) return NextResponse.json({ error: "Name and category are required" }, { status: 400 });

    const catId = parseInt(categoryId, 10);
    const cat = await prisma.category.findFirst({ where: { id: catId, tenantId } });
    if (!cat) return NextResponse.json({ error: "Invalid category" }, { status: 400 });

    const price = parseFloat(basePrice) || 0;
    const tax = parseFloat(taxRate) ?? 0.19;
    const pluVal = (plu || "").trim() || `PLU-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        tenantId,
        categoryId: catId,
        name: name.trim(),
        description: (description || "").trim(),
        plu: pluVal,
        basePrice: price,
        taxRate: tax,
        imageUrl: (imageUrl || "").trim() || null,
        isActive: true,
      },
    });
    return NextResponse.json({ success: true, product: { id: product.id, name: product.name } });
  } catch (err) {
    console.error("[products POST]", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tenantId = token.tenantId ?? null;
    if (!tenantId) return NextResponse.json({ error: "Restaurant context required" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"), 10);
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.product.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[products DELETE]", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
