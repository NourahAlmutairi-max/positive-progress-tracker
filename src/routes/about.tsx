import { createFileRoute } from "@tanstack/react-router";
import { heroSetup } from "@/lib/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About TECH PREMIUM | Considered Desk Technology" },
      {
        name: "description",
        content:
          "TECH PREMIUM builds considered desk technology for students, developers and everyday productivity, shipped across Kuwait.",
      },
      { property: "og:title", content: "About TECH PREMIUM" },
      {
        property: "og:description",
        content: "Considered desk technology for students, developers and everyday productivity.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">About TECH PREMIUM</h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        We design and curate a small, deliberate catalogue of desk technology. Every keyboard,
        mouse, headset and stand we carry has to earn its place on your desk: quiet where it should
        be quiet, tactile where it should be tactile, and built to outlast the trend cycle.
      </p>
      <div className="mt-8 overflow-hidden rounded-xl">
        <img
          src={heroSetup}
          alt="TECH PREMIUM workspace"
          loading="lazy"
          width={1280}
          height={960}
          className="w-full object-cover"
        />
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { t: "Free shipping over 50 KD", d: "Delivered across Kuwait in 1-3 working days." },
          { t: "2 year warranty", d: "Every product is covered against manufacturing defects." },
          { t: "Real support", d: "Talk to people who actually use the gear we sell." },
        ].map((b) => (
          <div key={b.t} className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-bold text-foreground">{b.t}</h2>
            <p className="mt-2 text-xs text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
