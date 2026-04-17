import "dotenv/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { platformPrisma } from "../lib/platform-db.js";
import { getTenantPrisma } from "../lib/tenant-db.js";
import { provisionTenantDatabaseAndMigrate } from "../lib/provision-tenant-database.js";
import { syncStaffLoginLookup } from "../lib/staff-login-lookup.js";

function hashDeviceToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await platformPrisma.superAdmin.upsert({
    where: { email: "admin@platform.com" },
    update: { name: "Super Admin" },
    create: {
      name: "Super Admin",
      email: "admin@platform.com",
      passwordHash: hashedPassword,
    },
  });

  let tenant = await platformPrisma.tenant.findFirst({ where: { subdomain: "demo" } });
  if (!tenant) {
    tenant = await platformPrisma.tenant.create({
      data: {
        name: "Demo Restaurant",
        subdomain: "demo",
        country: "Germany",
        status: "ACTIVE",
      },
    });
  } else if (!tenant.country) {
    tenant = await platformPrisma.tenant.update({
      where: { id: tenant.id },
      data: { country: "Germany" },
    });
  }

  if (!tenant.databaseUrl?.trim()) {
    await provisionTenantDatabaseAndMigrate(tenant.id);
    tenant = await platformPrisma.tenant.findUnique({ where: { id: tenant.id } });
  }

  const tdb = await getTenantPrisma(tenant.id);

  await tdb.tenant.upsert({
    where: { id: tenant.id },
    create: {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      country: tenant.country || "Germany",
      status: "ACTIVE",
    },
    update: {
      name: tenant.name,
      country: tenant.country || "Germany",
    },
  });

  let branch = await tdb.branch.findFirst({ where: { tenantId: tenant.id } });
  if (!branch) {
    branch = await tdb.branch.create({
      data: {
        tenantId: tenant.id,
        name: "Main Branch",
        address: "123 Demo St",
        city: "Demo City",
        country: "Germany",
      },
    });
  }

  // Ensure a basic set of dining tables exists for demo/QR flows.
  const desiredTableNames = ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5"];
  const ensuredTables = [];
  for (const name of desiredTableNames) {
    let t = await tdb.diningTable.findFirst({
      where: { tenantId: tenant.id, branchId: branch.id, name },
    });
    if (!t) {
      t = await tdb.diningTable.create({
        data: {
          tenantId: tenant.id,
          branchId: branch.id,
          name,
          seats: 4,
          status: "AVAILABLE",
        },
      });
    }
    ensuredTables.push(t);
  }

  const mainKdsScreen = await tdb.kDSScreen.upsert({
    where: {
      branchId_name: {
        branchId: branch.id,
        name: "Kitchen Main Screen",
      },
    },
    update: {
      code: "MAIN",
      stationType: "MAIN",
      isActive: true,
      isDefault: true,
    },
    create: {
      branchId: branch.id,
      name: "Kitchen Main Screen",
      code: "MAIN",
      stationType: "MAIN",
      isActive: true,
      isDefault: true,
    },
  });

  await tdb.kDSScreen.upsert({
    where: {
      branchId_name: {
        branchId: branch.id,
        name: "Drinks Station",
      },
    },
    update: {
      code: "DRINKS",
      stationType: "DRINKS",
      isActive: true,
      isDefault: false,
    },
    create: {
      branchId: branch.id,
      name: "Drinks Station",
      code: "DRINKS",
      stationType: "DRINKS",
      isActive: true,
      isDefault: false,
    },
  });

  let role = await tdb.role.findFirst({ where: { tenantId: tenant.id } });
  if (!role) {
    role = await tdb.role.create({
      data: {
        tenantId: tenant.id,
        name: "Manager",
      },
    });
  }

  let manager = await tdb.tenantAdmin.findFirst({ where: { tenantId: tenant.id } });
  if (!manager) {
    const managerPassword = await bcrypt.hash("tenant123", 12);
    manager = await tdb.tenantAdmin.create({
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
    manager = await tdb.tenantAdmin.update({
      where: { id: manager.id },
      data: {
        name: "Restaurant Admin",
        email: "tenant@demo.com",
        passwordHash: managerPassword,
      },
    });
  }

  const demoPosToken = "demo-pos-device-token";
  const demoKdsToken = "demo-kds-device-token";

  await tdb.deviceToken.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: "Demo POS Device",
      },
    },
    update: {
      branchId: branch.id,
      screenId: null,
      deviceType: "POS",
      status: "ACTIVE",
      tokenHash: hashDeviceToken(demoPosToken),
    },
    create: {
      tenantId: tenant.id,
      branchId: branch.id,
      screenId: null,
      name: "Demo POS Device",
      deviceType: "POS",
      status: "ACTIVE",
      tokenHash: hashDeviceToken(demoPosToken),
    },
  });

  await tdb.deviceToken.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: "Demo KDS Device",
      },
    },
    update: {
      branchId: branch.id,
      screenId: mainKdsScreen.id,
      deviceType: "KDS",
      status: "ACTIVE",
      tokenHash: hashDeviceToken(demoKdsToken),
    },
    create: {
      tenantId: tenant.id,
      branchId: branch.id,
      screenId: mainKdsScreen.id,
      name: "Demo KDS Device",
      deviceType: "KDS",
      status: "ACTIVE",
      tokenHash: hashDeviceToken(demoKdsToken),
    },
  });

  const demoTabletToken = "demo-tablet-device-token";
  await tdb.deviceToken.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: "Demo Table Tablet",
      },
    },
    update: {
      branchId: branch.id,
      screenId: null,
      deviceType: "TABLET",
      status: "ACTIVE",
      tokenHash: hashDeviceToken(demoTabletToken),
    },
    create: {
      tenantId: tenant.id,
      branchId: branch.id,
      screenId: null,
      name: "Demo Table Tablet",
      deviceType: "TABLET",
      status: "ACTIVE",
      tokenHash: hashDeviceToken(demoTabletToken),
    },
  });

  let waiterRole = await tdb.role.findFirst({
    where: { tenantId: tenant.id, name: "Waiter" },
  });
  if (!waiterRole) {
    waiterRole = await tdb.role.create({
      data: {
        tenantId: tenant.id,
        name: "Waiter",
      },
    });
  }

  let waiterUser = await tdb.tenantAdmin.findFirst({
    where: { tenantId: tenant.id, email: "waiter@demo.com" },
  });
  if (!waiterUser) {
    const waiterPassword = await bcrypt.hash("waiter123", 12);
    waiterUser = await tdb.tenantAdmin.create({
      data: {
        tenantId: tenant.id,
        branchId: branch.id,
        roleId: waiterRole.id,
        name: "Floor Waiter",
        email: "waiter@demo.com",
        passwordHash: waiterPassword,
        status: "ACTIVE",
      },
    });
  }

  const tabletPinHash = await bcrypt.hash("1234", 12);
  await tdb.tenant.update({
    where: { id: tenant.id },
    data: {
      tabletSettings: {
        waiterPinHash: tabletPinHash,
      },
    },
  });

  const productCount = await tdb.product.count({ where: { tenantId: tenant.id } });
  const addonCount = await tdb.addonGroup.count({ where: { tenantId: tenant.id } });

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
    const catPizzas = await tdb.category.create({
      data: { tenantId: tenant.id, name: "Pizzas" },
    });
    const catCombos = await tdb.category.create({
      data: { tenantId: tenant.id, name: "Combos" },
    });
    const catBurgers = await tdb.category.create({
      data: { tenantId: tenant.id, name: "Burgers" },
    });
    const catSides = await tdb.category.create({
      data: { tenantId: tenant.id, name: "Sides" },
    });
    const catDips = await tdb.category.create({
      data: { tenantId: tenant.id, name: "Dips" },
    });
    const catDrinks = await tdb.category.create({
      data: { tenantId: tenant.id, name: "Drinks" },
    });
    const catDesserts = await tdb.category.create({
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
      { cat: catDrinks, name: "Coca Cola", desc: "Classic Coca Cola 330ml", plu: "DRK001", price: 2.5, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=90", kdsStation: "DRINKS" },
      { cat: catDrinks, name: "Coke Zero", desc: "Coca Cola Zero Sugar 330ml", plu: "DRK002", price: 2.5, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=90", kdsStation: "DRINKS" },
      { cat: catDrinks, name: "Fresh Orange Juice", desc: "Freshly squeezed orange juice", plu: "DRK003", price: 5.0, img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=90", kdsStation: "DRINKS" },
      { cat: catDrinks, name: "Chocolate Milkshake", desc: "Creamy chocolate milkshake", plu: "DRK004", price: 6.0, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=90", kdsStation: "DRINKS" },
      { cat: catDesserts, name: "Ice Cream Sundae", desc: "Vanilla ice cream, chocolate syrup", plu: "DES001", price: 7.0, img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=90", kdsStation: "DESSERT" },
      { cat: catDesserts, name: "Brownie", desc: "Warm chocolate brownie with nuts", plu: "DES002", price: 6.5, img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=90", kdsStation: "DESSERT" },
    ];

    const products = await Promise.all(
      productsData.map((p) =>
        tdb.product.create({
          data: {
            tenantId: tenant.id,
            categoryId: p.cat.id,
            name: p.name,
            description: p.desc,
            plu: p.plu,
            basePrice: p.price,
            taxRate: 10,
            imageUrl: p.img,
            kdsStation: p.kdsStation || "MAIN",
          },
        })
      )
    );

    // Customers (Walk-in first for quick/takeaway; others for loyalty/tracking)
    const customers = await Promise.all([
      tdb.customer.create({
        data: {
          tenantId: tenant.id,
          name: "Walk-in",
          phone: "",
          email: "walkin@internal.local",
        },
      }),
      tdb.customer.create({
        data: {
          tenantId: tenant.id,
          name: "John Smith",
          phone: "1234567890",
          email: "john@example.com",
        },
      }),
      tdb.customer.create({
        data: {
          tenantId: tenant.id,
          name: "Jane Doe",
          phone: "1987654321",
          email: "jane@example.com",
        },
      }),
      tdb.customer.create({
        data: {
          tenantId: tenant.id,
          name: "Bob Wilson",
          phone: "1122334455",
          email: "bob@example.com",
        },
      }),
    ]);

    // Use the first ensured table for seeded sessions/orders.
    const table = ensuredTables[0];

    // Sessions and orders
    const now = new Date();
    const sessions = [];
    for (let i = 0; i < 5; i++) {
      const openedAt = new Date(now);
      openedAt.setDate(openedAt.getDate() - i);
      openedAt.setHours(12, 0, 0, 0);
      const closedAt = new Date(openedAt);
      closedAt.setHours(22, 0, 0, 0);
      const s = await tdb.session.create({
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
      const order = await tdb.order.create({
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
      await tdb.orderItem.create({
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
      await tdb.payment.create({
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
      await tdb.cashbookEntry.create({
        data: {
          tenantId: tenant.id,
          type: "received",
          amount: 10000 * m + Math.random() * 5000,
          createdAt: d,
        },
      });
      await tdb.cashbookEntry.create({
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
    const existingProducts = await tdb.product.findMany({ where: { tenantId: tenant.id }, select: { id: true, plu: true } });
    for (const p of existingProducts) {
      const img = productImageMap[p.plu];
      const kdsStation = p.plu.startsWith("DRK") ? "DRINKS" : p.plu.startsWith("DES") ? "DESSERT" : "MAIN";
      if (img) {
        await tdb.product.update({ where: { id: p.id }, data: { imageUrl: img, kdsStation } });
      } else {
        await tdb.product.update({ where: { id: p.id }, data: { kdsStation } });
      }
    }
    // Ensure Combos and Dips categories exist
    let catCombos = await tdb.category.findFirst({ where: { tenantId: tenant.id, name: "Combos" } });
    let catDips = await tdb.category.findFirst({ where: { tenantId: tenant.id, name: "Dips" } });
    if (!catCombos) {
      await tdb.category.create({ data: { tenantId: tenant.id, name: "Combos" } });
    }
    if (!catDips) {
      await tdb.category.create({ data: { tenantId: tenant.id, name: "Dips" } });
    }
  }

  if (addonCount === 0) {
    const addonCustom = await tdb.addonGroup.create({
      data: {
        tenantId: tenant.id,
        name: "Customizations",
        minSelect: 0,
        maxSelect: 5,
      },
    });
    await tdb.addonItem.createMany({
      data: [
        { groupId: addonCustom.id, name: "No Mushrooms", price: 0 },
        { groupId: addonCustom.id, name: "No Onion", price: 0 },
        { groupId: addonCustom.id, name: "Add Bacon", price: 1.5 },
        { groupId: addonCustom.id, name: "Extra Cheese", price: 2.0 },
      ],
    });
  }


  const defaultPlans = [
    {
      code: "basic",
      name: "Basic",
      description: "Essential operations for a single restaurant location.",
      monthlyPrice: 49,
      commissionPercent: 6,
      trialDays: 14,
      graceDays: 5,
      sortOrder: 1,
      features: {
        codes: ["POS", "TABLET", "REPORTS", "CASHBOOK", "TEAM_MANAGEMENT"],
        items: ["POS system", "Tableside tablet", "Reports", "Cashbook", "Team management"],
      },
    },
    {
      code: "premium",
      name: "Premium",
      description: "Advanced operational tooling for growing restaurants.",
      monthlyPrice: 129,
      commissionPercent: 4,
      trialDays: 14,
      graceDays: 7,
      sortOrder: 2,
      features: {
        codes: ["POS", "TABLET", "ONLINE_PAYMENTS", "SPLIT_PAYMENTS", "KDS", "REPORTS", "Z_REPORTS", "CASHBOOK", "TEAM_MANAGEMENT", "LOYALTY"],
        items: ["POS system", "Tableside tablet", "Online payments", "Split payments", "Kitchen display system", "Reports", "Z-reports", "Cashbook", "Team management", "Loyalty program"],
      },
    },
    {
      code: "enterprise",
      name: "Enterprise",
      description: "Full commercial feature set for multi-branch operators.",
      monthlyPrice: 249,
      commissionPercent: 2.5,
      trialDays: 21,
      graceDays: 10,
      sortOrder: 3,
      features: {
        codes: ["POS", "TABLET", "ONLINE_PAYMENTS", "SPLIT_PAYMENTS", "KDS", "REPORTS", "Z_REPORTS", "CASHBOOK", "TEAM_MANAGEMENT", "LOYALTY", "CUSTOMER_SEGMENTS", "EMAIL_CAMPAIGNS", "MULTI_BRANCH"],
        items: ["POS system", "Tableside tablet", "Online payments", "Split payments", "Kitchen display system", "Reports", "Z-reports", "Cashbook", "Team management", "Loyalty program", "Customer segments", "Email campaigns", "Multi-branch operations"],
      },
    },
  ];

  const legacyPlanNameMap = {
    Starter: "basic",
    Growth: "premium",
    Scale: "enterprise",
  };

  for (const [legacyName, targetCode] of Object.entries(legacyPlanNameMap)) {
    const targetPlan = defaultPlans.find((plan) => plan.code === targetCode);
    const legacyPlan = await platformPrisma.subscriptionPlan.findFirst({
      where: { name: legacyName, code: null },
    });

    if (legacyPlan && targetPlan) {
      await platformPrisma.subscriptionPlan.update({
        where: { id: legacyPlan.id },
        data: {
          code: targetPlan.code,
          name: targetPlan.name,
          description: targetPlan.description,
          monthlyPrice: targetPlan.monthlyPrice,
          commissionPercent: targetPlan.commissionPercent,
          trialDays: targetPlan.trialDays,
          graceDays: targetPlan.graceDays,
          sortOrder: targetPlan.sortOrder,
          features: targetPlan.features,
        },
      });
    }
  }

  for (const plan of defaultPlans) {
    await platformPrisma.subscriptionPlan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        commissionPercent: plan.commissionPercent,
        trialDays: plan.trialDays,
        graceDays: plan.graceDays,
        sortOrder: plan.sortOrder,
        features: plan.features,
      },
      create: plan,
    });
  }

  const premiumPlan = await platformPrisma.subscriptionPlan.findUnique({
    where: { code: "premium" },
  });

  const currentPeriodStart = new Date();
  currentPeriodStart.setDate(currentPeriodStart.getDate() - 15);
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 15);
  const previousPeriodStart = new Date(currentPeriodStart);
  previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
  const previousPeriodEnd = new Date(currentPeriodStart);

  let demoSubscription = await platformPrisma.tenantSubscription.findFirst({
    where: { tenantId: tenant.id },
    orderBy: { endDate: "desc" },
  });

  if (!demoSubscription) {
    demoSubscription = await platformPrisma.tenantSubscription.create({
      data: {
        tenantId: tenant.id,
        planId: premiumPlan.id,
        status: "ACTIVE",
        startDate: currentPeriodStart,
        endDate: currentPeriodEnd,
        gracePeriodEndsAt: new Date(currentPeriodEnd.getTime() + premiumPlan.graceDays * 24 * 60 * 60 * 1000),
        nextBillingDate: currentPeriodEnd,
        autoRenew: true,
        cancelAtPeriodEnd: false,
      },
    });
  } else {
    demoSubscription = await platformPrisma.tenantSubscription.update({
      where: { id: demoSubscription.id },
      data: {
        planId: premiumPlan.id,
        status: "ACTIVE",
        startDate: currentPeriodStart,
        endDate: currentPeriodEnd,
        gracePeriodEndsAt: new Date(currentPeriodEnd.getTime() + premiumPlan.graceDays * 24 * 60 * 60 * 1000),
        nextBillingDate: currentPeriodEnd,
        autoRenew: true,
        cancelAtPeriodEnd: false,
      },
    });
  }

  const previousInvoice = await platformPrisma.billingInvoice.upsert({
    where: { invoiceNumber: "INV-DEMO-2026-01" },
    update: {
      tenantId: tenant.id,
      subscriptionId: demoSubscription.id,
      planId: premiumPlan.id,
      status: "PAID",
      issuedAt: previousPeriodEnd,
      dueDate: previousPeriodEnd,
      periodStart: previousPeriodStart,
      periodEnd: previousPeriodEnd,
      subtotal: 161,
      taxAmount: 0,
      totalAmount: 161,
      lineItems: [
        { code: "subscription_fee", label: "Premium platform subscription", description: "Monthly platform fee", amount: 129 },
        { code: "commission", label: "Order commission", description: "4% commission on completed orders", amount: 32 },
      ],
      notes: "Seeded paid invoice for demo restaurant.",
    },
    create: {
      tenantId: tenant.id,
      subscriptionId: demoSubscription.id,
      planId: premiumPlan.id,
      invoiceNumber: "INV-DEMO-2026-01",
      status: "PAID",
      issuedAt: previousPeriodEnd,
      dueDate: previousPeriodEnd,
      periodStart: previousPeriodStart,
      periodEnd: previousPeriodEnd,
      subtotal: 161,
      taxAmount: 0,
      totalAmount: 161,
      lineItems: [
        { code: "subscription_fee", label: "Premium platform subscription", description: "Monthly platform fee", amount: 129 },
        { code: "commission", label: "Order commission", description: "4% commission on completed orders", amount: 32 },
      ],
      notes: "Seeded paid invoice for demo restaurant.",
    },
  });

  await platformPrisma.billingInvoice.upsert({
    where: { invoiceNumber: "INV-DEMO-2026-02" },
    update: {
      tenantId: tenant.id,
      subscriptionId: demoSubscription.id,
      planId: premiumPlan.id,
      status: "OPEN",
      issuedAt: currentPeriodStart,
      dueDate: currentPeriodEnd,
      periodStart: currentPeriodStart,
      periodEnd: currentPeriodEnd,
      subtotal: 173,
      taxAmount: 0,
      totalAmount: 173,
      lineItems: [
        { code: "subscription_fee", label: "Premium platform subscription", description: "Monthly platform fee", amount: 129 },
        { code: "commission", label: "Order commission", description: "4% commission on completed orders", amount: 44 },
      ],
      notes: "Seeded open invoice for demo restaurant.",
    },
    create: {
      tenantId: tenant.id,
      subscriptionId: demoSubscription.id,
      planId: premiumPlan.id,
      invoiceNumber: "INV-DEMO-2026-02",
      status: "OPEN",
      issuedAt: currentPeriodStart,
      dueDate: currentPeriodEnd,
      periodStart: currentPeriodStart,
      periodEnd: currentPeriodEnd,
      subtotal: 173,
      taxAmount: 0,
      totalAmount: 173,
      lineItems: [
        { code: "subscription_fee", label: "Premium platform subscription", description: "Monthly platform fee", amount: 129 },
        { code: "commission", label: "Order commission", description: "4% commission on completed orders", amount: 44 },
      ],
      notes: "Seeded open invoice for demo restaurant.",
    },
  });

  const existingSeedPayment = await platformPrisma.billingPayment.findFirst({
    where: { invoiceId: previousInvoice.id, reference: "SEED-DEMO-PAYMENT" },
  });
  if (!existingSeedPayment) {
    await platformPrisma.billingPayment.create({
      data: {
        invoiceId: previousInvoice.id,
        tenantId: tenant.id,
        amount: 161,
        method: "STRIPE",
        status: "SUCCEEDED",
        paidAt: previousPeriodEnd,
        reference: "SEED-DEMO-PAYMENT",
        notes: "Seeded demo payment.",
      },
    });
  } else {
    await platformPrisma.billingPayment.update({
      where: { id: existingSeedPayment.id },
      data: {
        method: "STRIPE",
      },
    });
  }



  await syncStaffLoginLookup("tenant@demo.com", tenant.id, manager.id);
  await syncStaffLoginLookup("waiter@demo.com", tenant.id, waiterUser.id);

  console.log("Seed completed:");
  console.log("  SuperAdmin:", admin.email, "/ admin123");
  console.log("  Tenant admin: tenant@demo.com / tenant123 (subdomain: demo)");
  console.log(`  Device POS: /pos/${tenant.id}?token=${demoPosToken}`);
  console.log(`  Device KDS: /kds/${tenant.id}?token=${demoKdsToken}`);
  console.log(`  Device TABLET: /tablet?token=${demoTabletToken}`);
  console.log("  Table QR pages:");
  console.log("    /table-qr  (admin dashboard page: generate + Download PNG)");
  for (const t of ensuredTables) {
    console.log(`    Table: ${t.name} -> /menu?tenant_id=${tenant.id}&table_id=${t.id}`);
  }
  await tdb.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await platformPrisma.$disconnect();
  });
