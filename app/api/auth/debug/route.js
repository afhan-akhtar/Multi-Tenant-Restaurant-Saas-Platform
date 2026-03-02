import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export async function GET() {
  const result = { ok: false, steps: [] };
  try {
    // 1. Check if SuperAdmin exists
    const admin = await prisma.superAdmin.findUnique({
      where: { email: "admin@platform.com" },
    });
    result.steps.push({
      step: "find_super_admin",
      found: !!admin,
      id: admin?.id,
    });
    if (!admin) {
      result.message = "SuperAdmin not found. Run: npx prisma db seed";
      return Response.json(result, { status: 200 });
    }

    // 2. Test password verification
    const valid = await verifyPassword("admin123", admin.passwordHash);
    result.steps.push({ step: "verify_password", valid });
    if (!valid) {
      result.message = "Password verification failed. Re-run seed to reset password.";
      return Response.json(result, { status: 200 });
    }

    result.ok = true;
    result.message = "Auth setup OK. Login should work with admin@platform.com / admin123";
    return Response.json(result, { status: 200 });
  } catch (err) {
    result.steps.push({ step: "error", error: err.message });
    result.message = err.message;
    return Response.json(result, { status: 200 });
  }
}
