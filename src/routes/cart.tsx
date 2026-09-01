import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatKD } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | TECH PREMIUM" },
      {
        name: "description",
        content: "Review the TECH PREMIUM products in your cart, adjust quantities and checkout in KD.",
      },
      { property: "og:title", content: "Your Cart | TECH PREMIUM" },
      { property: "og:description", content: "Review your items and proceed to checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, productOf, updateQuantity, removeFromCart, subtotal } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h1 className="truncate text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Your Cart
        </h1>
        <Link to="/shop" className="shrink-0 text-xs font-semibold text-primary hover:underline">
          ← Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-5 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Shop Collection
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {cart.map((item) => {
              const product = productOf(item);
              if (!product) return null;
              return (
                <li
                  key={item.id}
                  className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto]"
                >
                  <Link
                    to="/product/$productId"
                    params={{ productId: product.id }}
                    className="overflow-hidden rounded-lg bg-secondary"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      width={192}
                      height={192}
                      className="size-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0">
                    <Link
                      to="/product/$productId"
                      params={{ productId: product.id }}
                      className="text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    {item.option && (
                      <p className="mt-1 text-xs text-muted-foreground">{item.option}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="grid size-9 place-items-center hover:text-primary"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="grid size-9 place-items-center hover:text-primary"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  </div>

                  <p className="col-span-2 text-right text-sm font-bold text-foreground sm:col-span-1">
                    {formatKD(product.price * item.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
            <h2 className="text-base font-bold text-foreground">Order Summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold text-foreground">{formatKD(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="text-muted-foreground">
                  {subtotal >= 50 ? "Free" : "Calculated at checkout"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax</dt>
                <dd className="text-muted-foreground">Calculated at checkout</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-bold text-foreground">Total</dt>
                <dd className="font-extrabold text-foreground">{formatKD(subtotal)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-5 flex h-11 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Proceed to Checkout →
            </Link>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Secure checkout · Prices in KD
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
