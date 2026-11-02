import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  real,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export interface ProductVariantConfig {
  label: string;
  options: string[];
}

export interface OrderItemPayload {
  productId: number;
  slug: string;
  name: string;
  image: string;
  variant?: string;
  priceCents: number;
  quantity: number;
}

export interface ShippingAddressPayload {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  compareAtPriceCents: integer("compare_at_price_cents"),
  category: text("category").notNull(), // 'household' | 'beauty'
  subcategory: text("subcategory").notNull(),
  audience: text("audience").notNull(), // primary audience label: 'everyone' | 'females' | 'males' | 'young-adults' | 'adults'
  audiences: jsonb("audiences").$type<string[]>().notNull(),
  badge: text("badge"),
  images: jsonb("images").$type<string[]>().notNull(),
  variants: jsonb("variants").$type<ProductVariantConfig>().notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull(),
  detailsAndCare: text("details_and_care").notNull(),
  ritualNotes: text("ritual_notes").notNull(),
  stock: integer("stock").notNull().default(25),
  featured: boolean("featured").notNull().default(false),
  ratingAvg: real("rating_avg").notNull().default(4.9),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorTag: text("author_tag").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  verifiedPurchase: boolean("verified_purchase").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  shippingAddress: jsonb("shipping_address")
    .$type<ShippingAddressPayload>()
    .notNull(),
  shippingMethod: text("shipping_method").notNull(),
  items: jsonb("items").$type<OrderItemPayload[]>().notNull(),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  giftNote: text("gift_note"),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
