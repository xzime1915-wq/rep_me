import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateInvoiceNumber,
  generateOrderNumber,
} from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      state,
      zipCode,
      country,
      notes,
      paymentRef,
      items,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const settings = await prisma.storeSettings.findFirst();
    const shippingCost = settings?.shippingFlat ?? 9.99;
    const taxRate = settings?.taxRate ?? 0.08;

    let subtotal = 0;
    const orderItems: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      subtotal += product.price * item.quantity;
    }

    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;
    const orderNumber = generateOrderNumber();
    const invoiceNumber = generateInvoiceNumber(orderNumber);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          invoiceNumber,
          status: "pending_payment",
          paymentMethod: "bank_transfer",
          paymentRef: paymentRef || null,
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          state,
          zipCode,
          country: country || "United States",
          subtotal,
          shippingCost,
          tax,
          total,
          notes: notes || null,
          items: { create: orderItems },
        },
        include: { items: true },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");
  const email = searchParams.get("email");

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Order number and email required" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      customerEmail: email,
    },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
