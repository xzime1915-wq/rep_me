import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import { Button } from "@/components/Button";
import { CheckCircle, Building2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orderNumber } = await params;
  const { email } = await searchParams;

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      ...(email ? { customerEmail: email } : {}),
    },
    include: { items: true },
  });

  if (!order) notFound();

  const settings = await prisma.storeSettings.findFirst();

  return (
    <div className="container-trizen py-16 max-w-2xl mx-auto text-center">
      <CheckCircle className="h-16 w-16 mx-auto text-emerald-400 mb-6" />
      <h1 className="text-3xl font-bold uppercase mb-2">Order Placed!</h1>
      <p className="text-[var(--color-muted)] mb-8">
        Thank you, {order.customerName}. Your order has been received.
      </p>

      <div className="border border-[var(--color-border)] p-6 text-left bg-[var(--color-surface-elevated)] mb-8">
        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Order Number</p>
            <p className="font-mono font-semibold">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Invoice</p>
            <p className="font-mono font-semibold">{order.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Status</p>
            <p>{getStatusLabel(order.status)}</p>
          </div>
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Total</p>
            <p className="font-semibold">{formatCurrency(order.total)}</p>
          </div>
        </div>

        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" /> Complete Your Bank Transfer
        </h3>
        <p className="text-sm text-[var(--color-muted)] mb-4">
          Transfer <strong className="text-white">{formatCurrency(order.total)}</strong> to:
        </p>
        <ul className="text-sm space-y-1 font-mono">
          <li>{settings?.bankName}</li>
          <li>{settings?.accountName}</li>
          <li>Acct: {settings?.accountNumber}</li>
          <li>Routing: {settings?.routingNumber}</li>
        </ul>
        <p className="text-xs text-amber-400 mt-4">
          Use order number <strong>{order.orderNumber}</strong> as payment reference.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href={`/track-order?orderNumber=${order.orderNumber}&email=${encodeURIComponent(order.customerEmail)}`}>
          <Button variant="secondary">Track Order</Button>
        </Link>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
