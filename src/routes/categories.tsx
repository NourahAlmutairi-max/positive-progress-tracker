import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/lib/products";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories | TECH PREMIUM" },
      {
        name: "description",
        content:
          "Explore TECH PREMIUM categories: keyboards, accessories, audio and desk setup gear curated for focused work.",
      },
      { property: "og:title", content: "Categories | TECH PREMIUM" },
      {
        property: "og:description",
        content: "Keyboards, accessories, audio and desk setup gear curated for focused work.",
      },
    ],
  }),
  component: Categories,
});

function Categories() {
  const list = categories.filter((c) => c !== "All");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        Explore Setups
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Pick a category and build the workspace that fits how you actually work.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {list.map((c) => {
          const items = products.filter((p) => p.category === c);
          return (
            <Link
              key={c}
              to="/shop"
              search={{ category: c }}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="aspect-16/9 overflow-hidden bg-secondary">
                <img
                  src={items[0]?.images[0]}
                  alt={c}
                  loading="lazy"
                  width={1024}
                  height={576}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <h2 className="text-base font-bold text-foreground">{c}</h2>
                  <p className="text-xs text-muted-foreground">{items.length} products</p>
                </div>
                <span className="text-sm font-semibold text-primary">Shop →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
