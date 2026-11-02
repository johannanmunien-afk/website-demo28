import { db } from "@/db";
import {
  products,
  reviews,
  orders,
  newsletterSubscribers,
  type Product,
  type Review,
  type Order,
  type OrderItemPayload,
  type ShippingAddressPayload,
} from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { and, asc, desc, eq, gte, ilike, lte, ne, or, sql } from "drizzle-orm";

export interface ProductQueryFilters {
  category?: string;
  audience?: string;
  search?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  sort?: string;
}

export async function getFilteredProducts(
  filters: ProductQueryFilters = {}
): Promise<Product[]> {
  await ensureSeeded();

  const conditions = [];

  if (filters.category && filters.category !== "all") {
    conditions.push(eq(products.category, filters.category));
  }

  if (filters.audience && filters.audience !== "all") {
    conditions.push(
      sql`${products.audiences} @> ${JSON.stringify([filters.audience])}::jsonb`
    );
  }

  if (filters.search && filters.search.trim().length > 0) {
    const q = `%${filters.search.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, q),
        ilike(products.subtitle, q),
        ilike(products.description, q),
        ilike(products.subcategory, q)
      )
    );
  }

  if (
    typeof filters.minPriceCents === "number" &&
    !Number.isNaN(filters.minPriceCents)
  ) {
    conditions.push(gte(products.priceCents, filters.minPriceCents));
  }

  if (
    typeof filters.maxPriceCents === "number" &&
    !Number.isNaN(filters.maxPriceCents)
  ) {
    conditions.push(lte(products.priceCents, filters.maxPriceCents));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClauses;
  switch (filters.sort) {
    case "price-asc":
      orderByClauses = [asc(products.priceCents), asc(products.id)];
      break;
    case "price-desc":
      orderByClauses = [desc(products.priceCents), asc(products.id)];
      break;
    case "rating":
      orderByClauses = [
        desc(products.ratingAvg),
        desc(products.reviewCount),
        asc(products.id),
      ];
      break;
    case "newest":
      orderByClauses = [desc(products.id)];
      break;
    case "featured":
    default:
      orderByClauses = [
        desc(products.featured),
        desc(products.ratingAvg),
        asc(products.id),
      ];
      break;
  }

  const rows = await db
    .select()
    .from(products)
    .where(whereClause)
    .orderBy(...orderByClauses);

  if (
    filters.audience &&
    filters.audience !== "all" &&
    (!filters.sort || filters.sort === "featured")
  ) {
    const targetAudience = filters.audience;
    return [...rows].sort((a, b) => {
      const aPrimary = a.audience === targetAudience ? 1 : 0;
      const bPrimary = b.audience === targetAudience ? 1 : 0;
      if (aPrimary !== bPrimary) return bPrimary - aPrimary;
      return 0;
    });
  }

  return rows;
}

export async function getProductBySlug(slug: string): Promise<{
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
} | null> {
  await ensureSeeded();

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));

  if (!product) {
    return null;
  }

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt), desc(reviews.id));

  const sameCategory = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, product.category),
        ne(products.id, product.id)
      )
    )
    .orderBy(desc(products.featured), desc(products.ratingAvg))
    .limit(3);

  const crossCategory = await db
    .select()
    .from(products)
    .where(ne(products.category, product.category))
    .orderBy(desc(products.featured), desc(products.ratingAvg))
    .limit(1);

  return {
    product,
    reviews: productReviews,
    relatedProducts: [...sameCategory, ...crossCategory],
  };
}

export async function createProductReview(input: {
  slug: string;
  authorName: string;
  authorTag: string;
  rating: number;
  title: string;
  comment: string;
}): Promise<{ review: Review; ratingAvg: number; reviewCount: number } | null> {
  await ensureSeeded();

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, input.slug));

  if (!product) {
    return null;
  }

  const clampedRating = Math.min(5, Math.max(1, Math.round(input.rating)));

  const [createdReview] = await db
    .insert(reviews)
    .values({
      productId: product.id,
      authorName: input.authorName.trim(),
      authorTag: input.authorTag.trim() || "Kingdom Guest",
      rating: clampedRating,
      title: input.title.trim(),
      comment: input.comment.trim(),
      verifiedPurchase: true,
    })
    .returning();

  const allReviews = await db
    .select({ rating: reviews.rating })
    .from(reviews)
    .where(eq(reviews.productId, product.id));

  const reviewCount = allReviews.length;
  const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
  const ratingAvg =
    reviewCount > 0 ? Math.round((sum / reviewCount) * 10) / 10 : 5.0;

  await db
    .update(products)
    .set({ ratingAvg, reviewCount })
    .where(eq(products.id, product.id));

  return {
    review: createdReview,
    ratingAvg,
    reviewCount,
  };
}

export async function createOrderRecord(input: {
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddressPayload;
  shippingMethod: string;
  items: OrderItemPayload[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  giftNote?: string;
}): Promise<Order> {
  await ensureSeeded();

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const stamp = Date.now().toString().slice(-4);
  const orderNumber = `EK-${stamp}-${randomCode}`;

  const [created] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail.trim(),
      shippingAddress: input.shippingAddress,
      shippingMethod: input.shippingMethod,
      items: input.items,
      subtotalCents: input.subtotalCents,
      shippingCents: input.shippingCents,
      taxCents: input.taxCents,
      totalCents: input.totalCents,
      giftNote: input.giftNote?.trim() || null,
      status: "confirmed",
    })
    .returning();

  return created;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  await ensureSeeded();
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber));
  return order ?? null;
}

export async function subscribeNewsletter(email: string): Promise<void> {
  await db
    .insert(newsletterSubscribers)
    .values({ email: email.trim().toLowerCase() })
    .onConflictDoNothing({ target: newsletterSubscribers.email });
}
