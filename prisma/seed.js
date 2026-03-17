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

  // Demo tenant with tenant admins for testing Tenant Admin login
  let tenant = await prisma.tenant.findFirst({ where: { subdomain: "demo" } });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Demo Restaurant",
        subdomain: "demo",
        country: "Germany",
        status: "ACTIVE",
      },
    });
  } else if (!tenant.country) {
    tenant = await prisma.tenant.update({
      where: { id: tenant.id },
      data: { country: "Germany" },
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
        country: "Germany",
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

  let manager = await prisma.tenantAdmin.findFirst({ where: { tenantId: tenant.id } });
  if (!manager) {
    const managerPassword = await bcrypt.hash("tenant123", 12);
    manager = await prisma.tenantAdmin.create({
      data: {
        tenantId: tenant.id,
        branchId: branch.id,
        roleId: role.id,
        name: "Restaurant Admin",
        email: "tenant@demo.com",
        passwordHash: managerPassword,
        status: "ACTIVE",
      },
    });
  } else {
    const managerPassword = await bcrypt.hash("tenant123", 12);
    await prisma.tenantAdmin.update({
      where: { id: manager.id },
      data: {
        name: "Restaurant Admin",
        email: "tenant@demo.com",
        passwordHash: managerPassword,
      },
    });
  }

  const productCount = await prisma.product.count({ where: { tenantId: tenant.id } });
  const addonCount = await prisma.addonGroup.count({ where: { tenantId: tenant.id } });

  // Image map for updating existing products (PLU -> high-quality Unsplash URL)
  const productImageMap = {
    PIZ001: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=90",
    PIZ002: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=90",
    PIZ003: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=90",
    PIZ004: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=90",
    PIZ005: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=90",
    BUR001: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=90",
    BUR002: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=90",
    BUR003: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=90",
    BUR004: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=90",
    SID001: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=90",
    SID002: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=90",
    SID003: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=600&q=90",
    DRK001: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=90",
    DRK002: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=90",
    DRK003: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=90",
    DES001: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=90",
    DES002: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=90",
  };

  if (productCount === 0) {
    // Categories (matching professional POS layout: Pizzas, Combos, Sides, Dips, Drinks)
    const catPizzas = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Pizzas" },
    });
    const catCombos = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Combos" },
    });
    const catBurgers = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Burgers" },
    });
    const catSides = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Sides" },
    });
    const catDips = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Dips" },
    });
    const catDrinks = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Drinks" },
    });
    const catDesserts = await prisma.category.create({
      data: { tenantId: tenant.id, name: "Desserts" },
    });

    // Products with high-quality real food images (Unsplash - free to use, w=600 for sharp display)
    const productsData = [
      { cat: catPizzas, name: "Margherita Pizza", desc: "Tomato sauce, mozzarella, fresh basil", plu: "PIZ001", price: 10.0, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=90" },
      { cat: catPizzas, name: "Pepperoni Inferno", desc: "Pizza sauce, mozzarella, pepperoni, tomatoes, chilli & onions", plu: "PIZ002", price: 13.5, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=90" },
      { cat: catPizzas, name: "The Sizzler", desc: "Spicy beef, jalapeños, red peppers, mozzarella", plu: "PIZ003", price: 12.6, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=90" },
      { cat: catPizzas, name: "Hot n Spicy Pizza", desc: "Pizza sauce, mozzarella, pepperoni, tomatoes, chilli & onions", plu: "PIZ004", price: 13.5, img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&q=90" },
      { cat: catPizzas, name: "BBQ Pizza", desc: "BBQ sauce, grilled chicken, red onion, mozzarella", plu: "PIZ005", price: 12.3, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=90" },
      { cat: catPizzas, name: "Vegetariana Pizza", desc: "Bell peppers, olives, mushrooms, onions, tomato", plu: "PIZ006", price: 11.1, img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=90" },
      { cat: catPizzas, name: "La Espanola", desc: "Spanish chorizo, olives, manchego, roasted peppers", plu: "PIZ007", price: 14.0, img: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600&q=90" },
      { cat: catPizzas, name: "Hawaiian Pizza", desc: "Ham, pineapple, mozzarella, tomato sauce", plu: "PIZ008", price: 12.0, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=90" },
      { cat: catCombos, name: "Pizza & Drink Combo", desc: "Any medium pizza + soft drink 330ml", plu: "CMB001", price: 14.0, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=90" },
      { cat: catCombos, name: "Burger & Fries Combo", desc: "Classic burger with fries and drink", plu: "CMB002", price: 12.5, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=90" },
      { cat: catBurgers, name: "Classic Beef Burger", desc: "Angus beef, lettuce, tomato, cheese, special sauce", plu: "BUR001", price: 11.0, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=90" },
      { cat: catBurgers, name: "Cheese Burger", desc: "Double cheese, beef patty, pickles, lettuce", plu: "BUR002", price: 12.0, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=90" },
      { cat: catBurgers, name: "Chicken Burger", desc: "Crispy chicken fillet, mayo, lettuce", plu: "BUR003", price: 10.0, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=90" },
      { cat: catBurgers, name: "Double Patty Burger", desc: "Two beef patties, special sauce, cheese", plu: "BUR004", price: 15.0, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=90" },
      { cat: catSides, name: "French Fries", desc: "Crispy golden fries with seasoning", plu: "SID001", price: 4.0, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=90" },
      { cat: catSides, name: "Onion Rings", desc: "Crispy battered onion rings", plu: "SID002", price: 5.0, img: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=90" },
      { cat: catSides, name: "Garlic Bread", desc: "Toasted bread with garlic butter", plu: "SID003", price: 6.0, img: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=600&q=90" },
      { cat: catDips, name: "Garlic Mayo Dip", desc: "Creamy garlic mayonnaise", plu: "DIP001", price: 1.5, img: "https://images.unsplash.com/photo-1605516606192-4d0182ef16b2?w=600&q=90" },
      { cat: catDips, name: "BBQ Sauce", desc: "Smoky BBQ sauce", plu: "DIP002", price: 1.0, img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=90" },
      { cat: catDips, name: "Sour Cream", desc: "Cool sour cream dip", plu: "DIP003", price: 1.5, img: "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=90" },
      { cat: catDrinks, name: "Coca Cola", desc: "Classic Coca Cola 330ml", plu: "DRK001", price: 2.5, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=90" },
      { cat: catDrinks, name: "Coke Zero", desc: "Coca Cola Zero Sugar 330ml", plu: "DRK002", price: 2.5, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=90" },
      { cat: catDrinks, name: "Fresh Orange Juice", desc: "Freshly squeezed orange juice", plu: "DRK003", price: 5.0, img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=90" },
      { cat: catDrinks, name: "Chocolate Milkshake", desc: "Creamy chocolate milkshake", plu: "DRK004", price: 6.0, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=90" },
      { cat: catDesserts, name: "Ice Cream Sundae", desc: "Vanilla ice cream, chocolate syrup", plu: "DES001", price: 7.0, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=90" },
      { cat: catDesserts, name: "Brownie", desc: "Warm chocolate brownie with nuts", plu: "DES002", price: 6.5, img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=90" },
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

    // Customers (Walk-in first for quick/takeaway; others for loyalty/tracking)
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          tenantId: tenant.id,
          name: "Walk-in",
          phone: "",
          email: "walkin@internal.local",
        },
      }),
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
          waiterId: manager.id,
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
  } else {
    // Update existing products with high-quality images
    const existingProducts = await prisma.product.findMany({ where: { tenantId: tenant.id }, select: { id: true, plu: true } });
    for (const p of existingProducts) {
      const img = productImageMap[p.plu];
      if (img) {
        await prisma.product.update({ where: { id: p.id }, data: { imageUrl: img } });
      }
    }
    // Ensure Combos and Dips categories exist
    let catCombos = await prisma.category.findFirst({ where: { tenantId: tenant.id, name: "Combos" } });
    let catDips = await prisma.category.findFirst({ where: { tenantId: tenant.id, name: "Dips" } });
    if (!catCombos) {
      await prisma.category.create({ data: { tenantId: tenant.id, name: "Combos" } });
    }
    if (!catDips) {
      await prisma.category.create({ data: { tenantId: tenant.id, name: "Dips" } });
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
  console.log("  Tenant admin: tenant@demo.com / tenant123 (subdomain: demo)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
