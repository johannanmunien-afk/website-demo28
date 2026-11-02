"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/format";

export interface CartItem {
  key: string;
  productId: number;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  image: string;
  variant?: string;
  priceCents: number;
  quantity: number;
}

export interface AddCartInput {
  productId: number;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  image: string;
  variant?: string;
  priceCents: number;
}

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (
    item: AddCartInput,
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalCents: number;
  remainingForFreeShippingCents: number;
  freeShippingProgressPercent: number;
}

const STORAGE_KEY = "esthers_kingdom_cart_v1";

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items, isHydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (input: AddCartInput, quantity = 1, openDrawer = true) => {
      const key = `${input.productId}::${input.variant ?? "default"}`;
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.key === key);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        }
        return [
          ...prev,
          {
            key,
            productId: input.productId,
            slug: input.slug,
            name: input.name,
            subtitle: input.subtitle,
            category: input.category,
            image: input.image,
            variant: input.variant,
            priceCents: input.priceCents,
            quantity,
          },
        ];
      });
      if (openDrawer) {
        setIsOpen(true);
      }
    },
    []
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotalCents = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    [items]
  );

  const remainingForFreeShippingCents = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents
  );

  const freeShippingProgressPercent = Math.min(
    100,
    Math.round((subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100)
  );

  const value = useMemo(
    () => ({
      items,
      isHydrated,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotalCents,
      remainingForFreeShippingCents,
      freeShippingProgressPercent,
    }),
    [
      items,
      isHydrated,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotalCents,
      remainingForFreeShippingCents,
      freeShippingProgressPercent,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
