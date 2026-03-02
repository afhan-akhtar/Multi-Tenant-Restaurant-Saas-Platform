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
    update: { name: "Super Admin" },
    create: {
      name: "Super Admin",
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
        name: "Restaurant Admin",
        email: "staff@demo.com",
        passwordHash: staffPassword,
        status: "ACTIVE",
      },
    });
  } else {
    await prisma.staff.update({
      where: { id: staff.id },
      data: { name: "Restaurant Admin" },
    });
  }

  const productCount = await prisma.product.count({ where: { tenantId: tenant.id } });
  const addonCount = await prisma.addonGroup.count({ where: { tenantId: tenant.id } });

  if (productCount === 0) {
    // Categories
    const catPizzas = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Pizzas" },
    });
    const catBurgers = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Burgers" },
    });
    const catSides = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Sides" },
    });
    const catDrinks = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Drinks" },
    });
    const catDesserts = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Desserts" },
    });

    // Products with images (Unsplash - free to use)
    const productsData = [
      { cat: catPizzas, name: "Margherita Pizza", desc: "Tomato sauce, mozzarella, fresh basil", plu: "PIZ001", price: 12.0, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
      { cat: catPizzas, name: "Pepperoni Pizza", desc: "Spicy pepperoni, mozzarella, tomato sauce", plu: "PIZ002", price: 14.0, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80" },
      { cat: catPizzas, name: "BBQ Chicken Pizza", desc: "BBQ sauce, grilled chicken, red onion", plu: "PIZ003", price: 15.0, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
      { cat: catPizzas, name: "Veggie Supreme", desc: "Bell peppers, olives, mushrooms, onions", plu: "PIZ004", price: 13.0, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
      { cat: catPizzas, name: "Hawaiian Pizza", desc: "Ham, pineapple, mozzarella", plu: "PIZ005", price: 14.5, img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
      { cat: catBurgers, name: "Classic Beef Burger", desc: "Angus beef, lettuce, tomato, cheese", plu: "BUR001", price: 11.0, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
      { cat: catBurgers, name: "Cheese Burger", desc: "Double cheese, beef patty, pickles", plu: "BUR002", price: 12.0, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
      { cat: catBurgers, name: "Chicken Burger", desc: "Crispy chicken fillet, mayo, lettuce", plu: "BUR003", price: 10.0, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
      { cat: catBurgers, name: "Double Patty Burger", desc: "Two beef patties, special sauce", plu: "BUR004", price: 15.0, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80" },
      { cat: catSides, name: "French Fries", desc: "Crispy golden fries with seasoning", plu: "SID001", price: 4.0, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
      { cat: catSides, name: "Onion Rings", desc: "Crispy battered onion rings", plu: "SID002", price: 5.0, img: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80" },
      { cat: catSides, name: "Garlic Bread", desc: "Toasted bread with garlic butter", plu: "SID003", price: 6.0, img: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&q=80" },
      { cat: catDrinks, name: "Coca Cola", desc: "Classic Coca Cola 330ml", plu: "DRK001", price: 2.5, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80" },
      { cat: catDrinks, name: "Fresh Orange Juice", desc: "Freshly squeezed orange juice", plu: "DRK002", price: 5.0, img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80" },
      { cat: catDrinks, name: "Chocolate Milkshake", desc: "Creamy chocolate milkshake", plu: "DRK003", price: 6.0, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
      { cat: catDesserts, name: "Ice Cream Sundae", desc: "Vanilla ice cream, chocolate syrup", plu: "DES001", price: 7.0, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80" },
      { cat: catDesserts, name: "Brownie", desc: "Warm chocolate brownie", plu: "DES002", price: 6.5, img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&q=80" },
    ];

    const products = await Promise.all(
      productsData.map((p) =>
        prisma.product.create({
          data: {
            tenantId: tenant.id,
            categoryId: p.cat.id,
            name: p.name,
            description: p.desc,
            plu: p.plu,
            basePrice: p.price,
            taxRate: 10,
            imageUrl: p.img,
          },
        })
      )
    );

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

  if (addonCount === 0) {
    const addonCustom = await prisma.addonGroup.create({
      data: {
        tenantId: tenant.id,
        name: "Customizations",
        minSelect: 0,
        maxSelect: 5,
      },
    });
    await prisma.addonItem.createMany({
      data: [
        { groupId: addonCustom.id, name: "No Mushrooms", price: 0 },
        { groupId: addonCustom.id, name: "No Onion", price: 0 },
        { groupId: addonCustom.id, name: "Add Bacon", price: 1.5 },
        { groupId: addonCustom.id, name: "Extra Cheese", price: 2.0 },
      ],
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
