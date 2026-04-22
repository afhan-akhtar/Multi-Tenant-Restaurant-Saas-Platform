import { NextResponse } from "next/server";
import crypto from "crypto";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";
import { hashPassword } from "@/lib/password";
import { RESET_KIND } from "@/lib/password-reset-constants";

const MIN_LEN = 8;

function hashToken(raw) {
  return crypto.createHash("sha256").update(String(raw), "utf8").digest("hex");
}

function isStaffKind(k) {
  return k === RESET_KIND.STAFF || k === "staff";
}

function isSuperKind(k) {
  return k === RESET_KIND.SUPER_ADMIN || k === "super_admin";
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!token) {
      return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
    }
    if (password.length < MIN_LEN) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_LEN} characters.` },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const row = await platformPrisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!row || row.usedAt) {
      return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
    }
    if (row.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "This link has expired. Request a new one." }, { status: 400 });
    }

    const nextHash = await hashPassword(password);

    if (isSuperKind(row.kind)) {
      const admin = await platformPrisma.superAdmin.findFirst({
        where: { email: row.email },
      });
      if (!admin) {
        return NextResponse.json({ error: "Account not found." }, { status: 400 });
      }
      await platformPrisma.$transaction([
        platformPrisma.superAdmin.update({
          where: { id: admin.id },
          data: { passwordHash: nextHash },
        }),
        platformPrisma.passwordResetToken.update({
          where: { id: row.id },
          data: { usedAt: new Date() },
        }),
      ]);
      return NextResponse.json({ ok: true });
    }

    if (isStaffKind(row.kind) && row.tenantId != null && row.staffId != null) {
      const tdb = await getTenantPrisma(row.tenantId);
      const staff = await tdb.tenantAdmin.findFirst({
        where: { id: row.staffId, email: row.email, status: "ACTIVE" },
      });
      if (!staff) {
        return NextResponse.json({ error: "Account not found." }, { status: 400 });
      }
      await tdb.tenantAdmin.update({
        where: { id: staff.id },
        data: { passwordHash: nextHash },
      });
      await platformPrisma.passwordResetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid token data." }, { status: 400 });
  } catch (e) {
    console.error("[reset-password]", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
