import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Heart, Minus, Plus, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { formatKD, getProduct, products } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable | TECH PREMIUM" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} | TECH PREMIUM`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description.slice(0, 155) },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [imageIndex, setImageIndex] = useState(0);
  const [option, setOption] = useState(product.options?.values[0]);
  const [qty, setQty] = useState(1);

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);
  const wished = isWishlisted(product.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <Link to="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span>/</span>
        <Link
          to="/shop"
          search={{ category: product.category, q: undefined }}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-4/3 overflow-hidden rounded-xl border border-border bg-secondary">
            <img
              key={imageIndex}
              src={product.images[imageIndex]}
              alt={`${product.name} view ${imageIndex + 1}`}
              width={1024}
              height={768}
              className="size-full object-cover"
            />
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setImageIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={imageIndex === i}
                className={`size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-secondary transition ${
                  imageIndex === i ? "border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  width={160}
                  height={160}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-3">
            <Stars rating={product.rating} reviews={product.reviews} />
          </div>
          <p className="mt-4 text-3xl font-extrabold text-foreground">{formatKD(product.price)}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {product.options && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-foreground">{product.options.label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.options.values.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setOption(v)}
                    aria-pressed={option === v}
                    className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                      option === v
                        ? "bg-foreground text-background"
                        : "border border-border bg-background text-foreground hover:border-primary"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid size-11 place-items-center text-foreground hover:text-primary"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="grid size-11 place-items-center text-foreground hover:text-primary"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                addToCart(product, option, qty);
                toast.success(`${product.name} added to cart`);
              }}
              className="inline-flex h-11 flex-1 min-w-40 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <ShoppingCart className="size-4" /> Add to Cart
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              toggleWishlist(product.id);
              toast(wished ? "Removed from wishlist" : "Added to wishlist");
            }}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            <Heart className={`size-4 ${wished ? "fill-primary text-primary" : ""}`} />
            {wished ? "In Wishlist" : "Add to Wishlist"}
          </button>

          <div className="mt-6 flex flex-wrap gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Truck className="size-4" /> Free shipping over 50 KD
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-4" /> 2 Year Warranty
            </span>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-lg font-bold text-foreground">Technical Specifications</h2>
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {product.specs.map((s) => (
            <div key={s.title} className="flex gap-3 bg-card p-5">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Related Products</h2>
          <Link to="/shop" className="text-xs font-semibold text-primary hover:underline">
            View All →
          </Link>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
