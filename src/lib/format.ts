export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
export const STANDARD_SHIPPING_CENTS = 800;
export const EXPRESS_SHIPPING_CENTS = 1800;
export const TAX_RATE = 0.08;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Kingdom", shortLabel: "All" },
  { value: "everyone", label: "Everyone", shortLabel: "Everyone" },
  { value: "young-adults", label: "Young Adults", shortLabel: "Young Adults" },
  { value: "adults", label: "Adults", shortLabel: "Adults" },
  { value: "females", label: "Females", shortLabel: "Females" },
  { value: "males", label: "Males", shortLabel: "Males" },
] as const;

export const AUDIENCE_DISPLAY_MAP: Record<string, string> = {
  everyone: "For Everyone",
  "young-adults": "Young Adults",
  adults: "Adults",
  females: "For Her",
  males: "For Him",
};

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Offerings" },
  { value: "household", label: "Household Items" },
  { value: "beauty", label: "Beauty Items" },
] as const;

export const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  household: "Household Sanctuary",
  beauty: "Beauty & Apothecary",
};
