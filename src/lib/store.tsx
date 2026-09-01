import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "./products";

export type CartItem = {
  id: string;
  productId: string;
  option?: string;
  quantity: number;
};

type StoreValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, option?: string, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  productOf: (item: CartItem) => Product | undefined;
};

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "tech-premium-cart";
const WISH_KEY = "tech-premium-wishlist";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(read<CartItem[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const value = useMemo<StoreValue>(() => {
    const productOf = (item: CartItem) => products.find((p) => p.id === item.productId);

    return {
      cart,
      wishlist,
      cartCount: cart.reduce((n, i) => n + i.quantity, 0),
      subtotal: cart.reduce((sum, i) => {
        const p = products.find((pr) => pr.id === i.productId);
        return sum + (p ? p.price * i.quantity : 0);
      }, 0),
      addToCart: (product, option, quantity = 1) =>
        setCart((prev) => {
          const key = `${product.id}__${option ?? ""}`;
          const existing = prev.find((i) => i.id === key);
          if (existing) {
            return prev.map((i) => (i.id === key ? { ...i, quantity: i.quantity + quantity } : i));
          }
          return [...prev, { id: key, productId: product.id, option, quantity }];
        }),
      updateQuantity: (id, delta) =>
        setCart((prev) =>
          prev
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0),
        ),
      removeFromCart: (id) => setCart((prev) => prev.filter((i) => i.id !== id)),
      clearCart: () => setCart([]),
      toggleWishlist: (productId) =>
        setWishlist((prev) =>
          prev.includes(productId) ? prev.filter((p) => p !== productId) : [...prev, productId],
        ),
      isWishlisted: (productId) => wishlist.includes(productId),
      productOf,
    };
  }, [cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
