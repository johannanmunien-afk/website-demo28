import { NextRequest, NextResponse } from "next/server";
import { createOrderRecord, getOrderByNumber } from "@/lib/queries";
import {
  EXPRESS_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  STANDARD_SHIPPING_CENTS,
  TAX_RATE,
} from "@/lib/format";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required." },
        { status: 400 }
      );
    }

    const order = await getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Failed to lookup order:", error);
    return NextResponse.json(
      { error: "Unable to load order confirmation." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const customerName = String(body.customerName ?? "").trim();
    const customerEmail = String(body.customerEmail ?? "").trim();
    const shippingMethod = String(body.shippingMethod ?? "standard");
    const giftNote = body.giftNote ? String(body.giftNote).trim() : undefined;
    const address = body.shippingAddress ?? {};
    const items = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid full name and email address." },
        { status: 400 }
      );
    }

    if (
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postalCode
    ) {
      return NextResponse.json(
        { error: "Please complete all required shipping address fields." },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Your Kingdom bag is empty." },
        { status: 400 }
      );
    }

    const normalizedItems = items.map((item: Record<string, unknown>) => ({
      productId: Number(item.productId),
      slug: String(item.slug ?? ""),
      name: String(item.name ?? ""),
      image: String(item.image ?? ""),
      variant: item.variant ? String(item.variant) : undefined,
      priceCents: Math.max(0, Math.round(Number(item.priceCents ?? 0))),
      quantity: Math.max(1, Math.round(Number(item.quantity ?? 1))),
    }));

    const subtotalCents = normalizedItems.reduce(
      (sum: number, item: { priceCents: number; quantity: number }) =>
        sum + item.priceCents * item.quantity,
      0
    );

    const shippingCents =
      shippingMethod === "express"
        ? EXPRESS_SHIPPING_CENTS
        : subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS
          ? 0
          : STANDARD_SHIPPING_CENTS;

    const taxCents = Math.round(subtotalCents * TAX_RATE);
    const totalCents = subtotalCents + shippingCents + taxCents;

    const order = await createOrderRecord({
      customerName,
      customerEmail,
      shippingAddress: {
        line1: String(address.line1).trim(),
        line2: address.line2 ? String(address.line2).trim() : undefined,
        city: String(address.city).trim(),
        state: String(address.state).trim(),
        postalCode: String(address.postalCode).trim(),
        country: String(address.country ?? "United States").trim(),
      },
      shippingMethod,
      items: normalizedItems,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      giftNote,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Unable to process your order right now." },
      { status: 500 }
    );
  }
}
