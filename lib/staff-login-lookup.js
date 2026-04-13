import { platformPrisma } from "./platform-db.js";

export async function syncStaffLoginLookup(email, tenantId, staffId) {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  if (!e) return;
  await platformPrisma.staffLoginLookup.upsert({
    where: {
      email_tenantId: { email: e, tenantId },
    },
    create: { email: e, tenantId, staffId },
    update: { staffId },
  });
}

export async function removeStaffLoginLookupForEmail(email, tenantId) {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  await platformPrisma.staffLoginLookup.deleteMany({
    where: { email: e, tenantId },
  });
}
