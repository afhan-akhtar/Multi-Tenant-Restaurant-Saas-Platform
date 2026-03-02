require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.superAdmin.upsert({
    where: { email: "admin@platform.com" },
    update: {},
    create: {
      name: "Platform Admin",
      email: "admin@platform.com",
      passwordHash: hashedPassword,
    },
  });

  // Demo tenant with staff for testing Staff login
  let tenant = await prisma.tenant.findFirst({ where: { subdomain: "demo" } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Demo Restaurant",
        subdomain: "demo",
        status: "ACTIVE",
      },
    });

    const branch = await prisma.branch.create({
      data: {
        tenantId: tenant.id,
        name: "Main Branch",
        address: "123 Demo St",
        city: "Demo City",
        country: "Demo",
      },
    });

    const role = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: "Manager",
      },
    });

    const staffPassword = await bcrypt.hash("staff123", 12);
    await prisma.staff.create({
      data: {
        tenantId: tenant.id,
        branchId: branch.id,
        roleId: role.id,
        name: "Demo Staff",
        email: "staff@demo.com",
        passwordHash: staffPassword,
        status: "ACTIVE",
      },
    });
  }

  console.log("Seed completed:");
  console.log("  SuperAdmin:", admin.email, "/ admin123");
  console.log("  Staff: staff@demo.com / staff123 (subdomain: demo)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
