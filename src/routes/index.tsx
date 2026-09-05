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
      {
        property: "og:title",
        content: "TECH PREMIUM | Build a Setup That Works for You",
      },
      {
        property: "og:description",
        content:
          "Smart tech essentials designed for studying, coding, and everyday productivity.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [active, setActive] = useState<string>("All");

  const [goal, setGoal] = useState("");
  const [model, setModel] = useState("openrouter/free");
  const [advice, setAdvice] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const shown =
    active === "All"
      ? products
      : products.filter((p) => p.category === active);

  async function getRecommendation() {
    if (!goal.trim()) {
      setError("Please tell us what kind of setup you need.");
      setAdvice("");
      setRecommendation("");
      return;
    }

    setLoading(true);
    setError("");
    setAdvice("");
    setRecommendation("");

    try {
      const response = await fetch("/api/setup-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAdvice(data.advice);
      setRecommendation(data.recommendation);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

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
            Smart tech essentials designed for studying, coding, and everyday
            productivity.
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

      <section className="mt-10 rounded-2xl border border-border bg-background p-5 sm:p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            AI Setup Assistant
          </p>

          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Find the right setup for you
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Tell us what you need and our AI assistant will combine live API
            data with AI to suggest a practical setup.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="goal"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                What do you need your setup for?
              </label>

              <textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Example: I need a setup for coding and studying."
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="model"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                AI Model
              </label>

              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
              >
                <option value="openrouter/free">
                  OpenRouter Free Router
                </option>

                <option value="meta-llama/llama-3.2-3b-instruct:free">
                  Llama 3.2 Free
                </option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={getRecommendation}
                disabled={loading}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Generating Recommendation..." : "Get Recommendation"}
              </button>
            </div>
          </div>

          {loading && (
            <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              Loading live data and generating your AI recommendation...
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {advice && (
            <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5">
              <h3 className="font-semibold text-foreground">
                Live API Advice
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {advice}
              </p>
            </div>
          )}

          {recommendation && (
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-5">
              <h3 className="font-semibold text-foreground">
                TECH PREMIUM AI Recommendation
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {recommendation}
              </p>
            </div>
          )}
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
          <p className="mt-8 text-sm text-muted-foreground">
            No products in this category yet.
          </p>
        )}
      </section>
    </div>
  );
}
