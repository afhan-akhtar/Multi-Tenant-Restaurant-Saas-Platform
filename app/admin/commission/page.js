import { auth } from "@/lib/auth";
import { platformPrisma } from "@/lib/platform-db";
import { redirect } from "next/navigation";
import CommissionClient from "@/app/components/CommissionClient";
import { runSubscriptionBillingCycle, serializeSubscription } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export default async function AdminCommissionPage() {
  const session = await auth();
  if (!session || session.user?.type !== "super_admin") redirect("/admin");

  await runSubscriptionBillingCycle(platformPrisma);

  const [plans, subscriptions, invoices] = await Promise.all([
    platformPrisma.subscriptionPlan.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { tenantSubscriptions: true } } },
    }),
    platformPrisma.tenantSubscription.findMany({
      include: {
        tenant: true,
        plan: true,
        invoices: {
          include: {
            payments: {
              orderBy: { paidAt: "desc" },
            },
          },
          orderBy: [{ periodEnd: "desc" }, { issuedAt: "desc" }],
        },
      },
      orderBy: [{ endDate: "desc" }, { createdAt: "desc" }],
    }),
    platformPrisma.billingInvoice.findMany({
      include: {
        tenant: true,
        plan: true,
        payments: {
          orderBy: { paidAt: "desc" },
        },
      },
      orderBy: [{ issuedAt: "desc" }],
    }),
  ]);

  const data = {
    plans: plans.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description || "",
      monthlyPrice: Number(p.monthlyPrice),
      commissionPercent: Number(p.commissionPercent),
      trialDays: Number(p.trialDays || 0),
      graceDays: Number(p.graceDays || 0),
      subscriptionCount: p._count.tenantSubscriptions,
    })),
    subscriptions: subscriptions.map((subscription) => serializeSubscription(subscription)),
    invoices: invoices.map((invoice) => ({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      tenantName: invoice.tenant?.name || "",
      subdomain: invoice.tenant?.subdomain || "",
      planName: invoice.plan?.name || "",
      status: invoice.status,
      totalAmount: Number(invoice.totalAmount || 0),
      dueDate: invoice.dueDate?.toISOString?.() || null,
      issuedAt: invoice.issuedAt?.toISOString?.() || null,
      payments: (invoice.payments || []).map((payment) => ({
        id: payment.id,
        amount: Number(payment.amount || 0),
        method: payment.method,
        reference: payment.reference || "",
        paidAt: payment.paidAt?.toISOString?.() || null,
      })),
    })),
  };

  const totalRevenue = data.invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const totalPaid = data.invoices.reduce(
    (sum, invoice) => sum + invoice.payments.reduce((invoiceSum, payment) => invoiceSum + payment.amount, 0),
    0
  );
  const totalOutstanding = data.invoices
    .filter((invoice) => invoice.status === "OPEN" || invoice.status === "OVERDUE")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

  return (
    <CommissionClient
      data={data}
      totals={{ revenue: totalRevenue, paid: totalPaid, outstanding: totalOutstanding }}
    />
  );
}
