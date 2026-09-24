"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatCurrency, STORE_CURRENCY } from "@/lib/utils";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { Building2, Copy, Check } from "lucide-react";

type Settings = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban: string;
  paymentInstructions: string;
  shippingFlat: number;
  taxRate: number;
  currency: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    notes: "",
    paymentRef: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  if (items.length === 0) {
    return (
      <div className="container-trizen py-20 text-center">
        <p className="text-[var(--color-muted)] mb-6">Your cart is empty.</p>
        <Button onClick={() => router.push("/shop")}>Go to Shop</Button>
      </div>
    );
  }

  const shipping = settings?.shippingFlat ?? 9.99;
  const taxRate = settings?.taxRate ?? 0.08;
  const currency = settings?.currency ?? STORE_CURRENCY;
  const sub = subtotal();
  const tax = Math.round(sub * taxRate * 100) / 100;
  const total = Math.round((sub + shipping + tax) * 100) / 100;
  const fmt = (amount: number) => formatCurrency(amount, currency);

  function copyText(label: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}?email=${encodeURIComponent(form.customerEmail)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-trizen py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">
              Shipping Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
              <Input
                label="Email *"
                type="email"
                required
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              />
              <Input
                label="Phone *"
                required
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              />
              <Input
                label="Country"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
              <Input
                label="Address *"
                required
                className="sm:col-span-2"
                value={form.shippingAddress}
                onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
              />
              <Input
                label="City *"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Input
                label="State *"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
              <Input
                label="ZIP Code *"
                required
                value={form.zipCode}
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="Order Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </section>

          <section className="border border-[var(--color-border)] p-6 bg-[var(--color-surface-elevated)]">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5" />
              <h2 className="text-sm font-semibold uppercase tracking-widest">
                Bank Transfer Payment
              </h2>
            </div>
            <p className="text-sm text-[var(--color-muted)] mb-6">
              {settings?.paymentInstructions ||
                "Transfer the total amount using your order number as reference after placing the order."}
            </p>
            {settings && (
              <div className="space-y-3 text-sm">
                {[
                  ["Bank", settings.bankName],
                  ["Account Name", settings.accountName],
                  ["Account Number", settings.accountNumber],
                  ["Routing Number", settings.routingNumber],
                  ["SWIFT/BIC", settings.swiftCode],
                  ...(settings.iban ? [["IBAN", settings.iban] as const] : []),
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 py-2 border-b border-[var(--color-border)] last:border-0"
                  >
                    <span className="text-[var(--color-muted)]">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{value}</span>
                      <button
                        type="button"
                        onClick={() => copyText(label, value)}
                        className="p-1 hover:text-white text-[var(--color-muted)]"
                        aria-label={`Copy ${label}`}
                      >
                        {copied === label ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Input
                label="Payment Reference (optional — add after transfer)"
                placeholder="Your bank transfer reference"
                value={form.paymentRef}
                onChange={(e) => setForm({ ...form, paymentRef: e.target.value })}
              />
            </div>
          </section>
        </div>

        <div className="border border-[var(--color-border)] p-6 h-fit bg-[var(--color-surface-elevated)]">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">
            Order Summary
          </h2>
          <ul className="space-y-2 text-sm mb-4 border-b border-[var(--color-border)] pb-4">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-2">
                <span className="text-[var(--color-muted)] truncate">
                  {i.name} × {i.quantity}
                </span>
                <span>{fmt(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span>{fmt(sub)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Shipping</span>
              <span>{fmt(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Tax</span>
              <span>{fmt(tax)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-[var(--color-border)]">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
          <p className="text-[10px] text-[var(--color-muted)] mt-3 text-center">
            By placing your order you agree to complete bank transfer within 48 hours.
          </p>
        </div>
      </form>
    </div>
  );
}
