import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { formatKD, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition hover:text-primary"
      >
        <Heart className={`size-4 ${wished ? "fill-primary text-primary" : ""}`} />
      </button>

      <Link to="/product/$productId" params={{ productId: product.id }} className="block">
        <div className="aspect-4/3 overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            width={1024}
            height={768}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-1 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="min-w-0 text-sm font-semibold text-foreground">{product.name}</h3>
            <span className="shrink-0 text-sm font-bold text-foreground">
              {formatKD(product.price)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{product.tagline}</p>
        </div>
      </Link>
    </div>
  );
}
