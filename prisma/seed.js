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
  }

  let branch = await prisma.branch.findFirst({ where: { tenantId: tenant.id } });
  if (!branch) {
    branch = await prisma.branch.create({
      data: {
        tenantId: tenant.id,
        name: "Main Branch",
        address: "123 Demo St",
        city: "Demo City",
        country: "Demo",
      },
    });
  }

  let role = await prisma.role.findFirst({ where: { tenantId: tenant.id } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: "Manager",
      },
    });
  }

  let staff = await prisma.staff.findFirst({ where: { tenantId: tenant.id } });
  if (!staff) {
    const staffPassword = await bcrypt.hash("staff123", 12);
    staff = await prisma.staff.create({
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

  const productCount = await prisma.product.count({ where: { tenantId: tenant.id } });
  if (productCount === 0) {
    // Categories
    const catAppetizers = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Appetizers" },
    });
    const catMain = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Main Course" },
    });
    const catDesserts = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Desserts" },
    });
    const catBeverages = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Beverages" },
    });

    // Products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          tenantId: tenant.id,
          categoryId: catAppetizers.id,
          name: "Bruschetta",
          description: "Toasted bread with tomato",
          plu: "APP001",
          basePrice: 8.5,
          taxRate: 10,
        },
      }),
      prisma.product.create({
        data: {
          tenantId: tenant.id,
          categoryId: catMain.id,
          name: "Grilled Salmon",
          description: "Fresh salmon with herbs",
          plu: "MAIN001",
          basePrice: 22.0,
          taxRate: 10,
        },
      }),
      prisma.product.create({
        data: {
          tenantId: tenant.id,
          categoryId: catDesserts.id,
          name: "Tiramisu",
          description: "Classic Italian dessert",
          plu: "DES001",
          basePrice: 9.0,
          taxRate: 10,
        },
      }),
      prisma.product.create({
        data: {
          tenantId: tenant.id,
          categoryId: catBeverages.id,
          name: "Fresh Orange Juice",
          description: "Freshly squeezed",
          plu: "BEV001",
          basePrice: 5.0,
          taxRate: 10,
        },
      }),
    ]);

    // Customers
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          tenantId: tenant.id,
          name: "John Smith",
          phone: "+1234567890",
          email: "john@example.com",
        },
      }),
      prisma.customer.create({
        data: {
          tenantId: tenant.id,
          name: "Jane Doe",
          phone: "+1987654321",
          email: "jane@example.com",
        },
      }),
      prisma.customer.create({
        data: {
          tenantId: tenant.id,
          name: "Bob Wilson",
          phone: "+1122334455",
          email: "bob@example.com",
        },
      }),
    ]);

    // Dining table
    const table = await prisma.diningTable.create({
      data: {
        tenantId: tenant.id,
        branchId: branch.id,
        name: "Table 1",
        seats: 4,
        status: "AVAILABLE",
      },
    });

    // Sessions and orders
    const now = new Date();
    const sessions = [];
    for (let i = 0; i < 5; i++) {
      const openedAt = new Date(now);
      openedAt.setDate(openedAt.getDate() - i);
      openedAt.setHours(12, 0, 0, 0);
      const closedAt = new Date(openedAt);
      closedAt.setHours(22, 0, 0, 0);
      const s = await prisma.session.create({
        data: {
          tenantId: tenant.id,
          branchId: branch.id,
          tableId: table.id,
          waiterId: staff.id,
          openedAt,
          closedAt,
        },
      });
      sessions.push(s);
    }

    // Create orders with payments
    const orderNumbers = ["ORD001", "ORD002", "ORD003", "ORD004", "ORD005"];
    for (let i = 0; i < 5; i++) {
      const session = sessions[i];
      const customer = customers[i % customers.length];
      const openedAt = new Date(session.openedAt);
      const grandTotal = 45 + i * 15;
      const order = await prisma.order.create({
        data: {
          tenantId: tenant.id,
          branchId: branch.id,
          sessionId: session.id,
          tableId: table.id,
          customerId: customer.id,
          orderNumber: orderNumbers[i],
          orderType: "DINE_IN",
          status: "COMPLETED",
          subtotal: grandTotal / 1.1,
          taxAmount: (grandTotal / 1.1) * 0.1,
          discountAmount: 0,
          tipAmount: grandTotal * 0.1,
          grandTotal,
          createdAt: openedAt,
        },
      });

      // Order items
      const prod = products[i % products.length];
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: prod.id,
          productName: prod.name,
          unitPrice: Number(prod.basePrice),
          taxRate: Number(prod.taxRate),
          quantity: 1 + i,
          totalAmount: Number(prod.basePrice) * (1 + i),
          status: "COMPLETED",
        },
      });

      // Payments
      const methods = ["CASH", "CARD", "STRIPE", "CASH", "PAYPAL"];
      await prisma.payment.create({
        data: {
          orderId: order.id,
          method: methods[i],
          status: "COMPLETED",
          amount: grandTotal,
          createdAt: openedAt,
        },
      });
    }

    // Cashbook entries for cash flow chart
    for (let m = 1; m <= 6; m++) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 15);
      await prisma.cashbookEntry.create({
        data: {
          tenantId: tenant.id,
          type: "received",
          amount: 10000 * m + Math.random() * 5000,
          createdAt: d,
        },
      });
      await prisma.cashbookEntry.create({
        data: {
          tenantId: tenant.id,
          type: "sent",
          amount: 5000 * m + Math.random() * 3000,
          createdAt: d,
        },
      });
    }
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
