import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categories, heroSetup, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TECH PREMIUM | Premium Keyboards, Mice & Desk Setup Gear" },
      {
        name: "description",
        content:
          "Shop TECH PREMIUM for mechanical keyboards, ergonomic mice, audio and desk setup essentials. Prices in KD with fast Kuwait delivery.",
      },
      { property: "og:title", content: "TECH PREMIUM | Build a Setup That Works for You" },
      {
        property: "og:description",
        content: "Smart tech essentials designed for studying, coding, and everyday productivity.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="grid items-center gap-8 rounded-2xl bg-secondary/60 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            Build a Setup
            <br />
            That Works for You
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
            Smart tech essentials designed for studying, coding, and everyday productivity.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Shop Collection
            </Link>
            <Link
              to="/categories"
              className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Explore Setups
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl">
          <img
            src={heroSetup}
            alt="Minimal desk setup with monitor, keyboard and mouse"
            width={1280}
            height={960}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
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

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">No products in this category yet.</p>
        )}
      </section>
    </div>
  );
}
