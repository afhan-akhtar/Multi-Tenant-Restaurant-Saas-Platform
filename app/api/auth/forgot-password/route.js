import { NextResponse } from "next/server";
import crypto from "crypto";
import { platformPrisma } from "@/lib/platform-db";
import { getTenantPrisma } from "@/lib/tenant-db";
import { getAppBaseUrl } from "@/lib/app-url";
import { sendPasswordResetEmail } from "@/lib/mail";
import { RESET_KIND } from "@/lib/password-reset-constants";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(raw) {
  return crypto.createHash("sha256").update(String(raw), "utf8").digest("hex");
}

function newRawToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * @param {object} p
 * @param {"super_admin"|"staff"} p.kind
 * @param {string} p.email
 * @param {string} [p.name] recipient display name
 * @param {number} [p.tenantId] staff
 * @param {number} [p.staffId] staff
 */
async function createAndSendReset({ kind, email, name, tenantId, staffId }) {
  const raw = newRawToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await platformPrisma.passwordResetToken.create({
    data: {
      tokenHash,
      email,
      kind,
      tenantId: kind === RESET_KIND.STAFF ? tenantId : null,
      staffId: kind === RESET_KIND.STAFF ? staffId : null,
      expiresAt,
    },
  });

  const base = getAppBaseUrl();
  const resetUrl = `${base}/reset-password?token=${encodeURIComponent(raw)}`;
  await sendPasswordResetEmail({ to: email, resetUrl, recipientName: name || "" });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const notRegistered = () =>
      NextResponse.json(
        { error: "Invalid email. This address is not registered." },
        { status: 400 }
      );

    const superA = await platformPrisma.superAdmin.findUnique({ where: { email } });
    if (superA) {
      await createAndSendReset({
        kind: RESET_KIND.SUPER_ADMIN,
        email: superA.email,
        name: superA.name,
      });
      return NextResponse.json({ ok: true });
    }

    const lookups = await platformPrisma.staffLoginLookup.findMany({
      where: { email },
    });

    if (lookups.length === 0) {
      return notRegistered();
    }

    let sent = 0;
    for (const l of lookups) {
      const platformTenant = await platformPrisma.tenant.findFirst({
        where: { id: l.tenantId, status: "ACTIVE" },
      });
      if (!platformTenant?.databaseUrl) {
        continue;
      }

      const tdb = await getTenantPrisma(l.tenantId);
      const staff = await tdb.tenantAdmin.findFirst({
        where: { id: l.staffId, email, status: "ACTIVE" },
      });
      if (!staff) {
        continue;
      }

      await createAndSendReset({
        kind: RESET_KIND.STAFF,
        email: staff.email,
        name: staff.name,
        tenantId: l.tenantId,
        staffId: staff.id,
      });
      sent += 1;
    }

    if (sent === 0) {
      return notRegistered();
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
