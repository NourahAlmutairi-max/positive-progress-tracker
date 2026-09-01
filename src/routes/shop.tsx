import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

type ShopSearch = { q?: string | undefined; category?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const q = search["q"];
    const category = search["category"];
    return {
      q: typeof q === "string" && q ? q : undefined,
      category: typeof category === "string" && category ? category : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop All Products | TECH PREMIUM" },
      {
        name: "description",
        content:
          "Browse every TECH PREMIUM product: mechanical keyboards, wireless mice, headsets, stands and desk mats. Filter and search in KD.",
      },
      { property: "og:title", content: "Shop All Products | TECH PREMIUM" },
      {
        property: "og:description",
        content: "Filter and search the full TECH PREMIUM catalogue of desk and tech essentials.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { q, category } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const active = category ?? "All";

  const shown = products.filter((p) => {
    const matchesCat = active === "All" || p.category === active;
    const term = (q ?? "").toLowerCase();
    const matchesQuery =
      !term ||
      p.name.toLowerCase().includes(term) ||
      p.tagline.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Shop</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {shown.length} product{shown.length === 1 ? "" : "s"} available
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q ?? ""}
            onChange={(e) =>
              navigate({
                search: (prev) => ({ ...prev, q: e.target.value || undefined }),
                replace: true,
              })
            }
            placeholder="Search products"
            aria-label="Search products"
            className="h-11 w-full rounded-md border border-border bg-secondary pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-background"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() =>
                navigate({
                  search: (prev) => ({ ...prev, category: c === "All" ? undefined : c }),
                })
              }
              aria-pressed={active === c}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                active === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {shown.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          No products matched your search. Try a different term or category.
        </p>
      )}
    </div>
  );
}
