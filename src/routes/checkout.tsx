import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { formatKD } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | TECH PREMIUM" },
      {
        name: "description",
        content: "Enter your contact and shipping details to complete your TECH PREMIUM order in KD.",
      },
      { property: "og:title", content: "Checkout | TECH PREMIUM" },
      { property: "og:description", content: "Complete your TECH PREMIUM order securely." },
    ],
  }),
  component: Checkout,
});

const schema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  country: z.string().trim().min(1, "Country is required"),
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  address: z.string().trim().min(1, "Address is required").max(180),
  apartment: z.string().trim().max(80).optional(),
  city: z.string().trim().min(1, "City is required").max(80),
  postalCode: z.string().trim().min(1, "Postal code is required").max(20),
  phone: z.string().trim().max(30).optional(),
});

type Fields = z.infer<typeof schema>;

const emptyForm: Fields = {
  email: "",
  country: "Kuwait",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  postalCode: "",
  phone: "",
};

const DISCOUNTS: Record<string, number> = { NOVA10: 0.1, SETUP15: 0.15 };

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  optional,
}: {
  label: string;
  name: keyof Fields;
  value: string;
  onChange: (name: keyof Fields, value: string) => void;
  error?: string | undefined;
  type?: string | undefined;
  optional?: boolean | undefined;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="text-xs font-medium text-muted-foreground">
        {label}
        {optional && " (optional)"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={!!error}
        className={`mt-1 h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-primary ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Checkout() {
  const { cart, productOf, subtotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState<Fields>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const setField = (name: keyof Fields, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const discountValue = subtotal * discount;
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 2;
  const total = Math.max(0, subtotal - discountValue) + shipping;

  const applyCode = () => {
    const rate = DISCOUNTS[code.trim().toUpperCase()];
    if (rate) {
      setDiscount(rate);
      toast.success(`Discount applied: ${rate * 100}% off`);
    } else {
      setDiscount(0);
      toast.error("That discount code is not valid");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const next: Partial<Record<keyof Fields, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof Fields;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    toast.success("Shipping details saved. Order confirmed!");
    clearCart();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        Checkout
      </h1>
      <ol className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <li className="font-semibold text-foreground">Information</li>
        <li>›</li>
        <li>Shipping</li>
        <li>›</li>
        <li>Payment</li>
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} noValidate className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate text-base font-bold text-foreground">Contact Information</h2>
              <span className="shrink-0 text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/about" className="font-semibold text-primary hover:underline">
                  Log in
                </Link>
              </span>
            </div>
            <div className="mt-4">
              <Field
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={setField}
                error={errors.email}
              />
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="size-4 accent-[var(--primary)]" />
              Email me with news and offers
            </label>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-bold text-foreground">Shipping Address</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="country" className="text-xs font-medium text-muted-foreground">
                  Country/Region
                </label>
                <select
                  id="country"
                  value={form.country}
                  onChange={(e) => setField("country", e.target.value)}
                  className="mt-1 h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  {["Kuwait", "Saudi Arabia", "United Arab Emirates", "Qatar", "Bahrain", "Oman"].map(
                    (c) => (
                      <option key={c}>{c}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={setField}
                  error={errors.firstName}
                />
                <Field
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={setField}
                  error={errors.lastName}
                />
              </div>
              <Field
                label="Address"
                name="address"
                value={form.address}
                onChange={setField}
                error={errors.address}
              />
              <Field
                label="Apartment, suite, etc."
                name="apartment"
                optional
                value={form.apartment ?? ""}
                onChange={setField}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={setField}
                  error={errors.city}
                />
                <Field
                  label="Postal Code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={setField}
                  error={errors.postalCode}
                />
              </div>
              <Field
                label="Phone"
                name="phone"
                optional
                type="tel"
                value={form.phone ?? ""}
                onChange={setField}
              />
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/cart" className="text-xs font-semibold text-primary hover:underline">
              ← Return to cart
            </Link>
            <button
              type="submit"
              className="inline-flex h-11 flex-1 min-w-48 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Lock className="size-4" /> Continue to Shipping
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-foreground">Order Summary</h2>

          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Your cart is empty.{" "}
              <Link to="/shop" className="font-semibold text-primary hover:underline">
                Add products
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {cart.map((item) => {
                const product = productOf(item);
                if (!product) return null;
                return (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        width={112}
                        height={112}
                        className="size-full object-cover"
                      />
                      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {product.name}
                      </p>
                      {item.option && (
                        <p className="truncate text-[11px] text-muted-foreground">{item.option}</p>
                      )}
                    </div>
                    <p className="shrink-0 text-xs font-semibold text-foreground">
                      {formatKD(product.price * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-5 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Discount code"
              aria-label="Discount code"
              className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={applyCode}
              className="h-10 shrink-0 rounded-md border border-border px-4 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Apply
            </button>
          </div>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold text-foreground">{formatKD(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount</dt>
                <dd className="font-semibold text-primary">-{formatKD(discountValue)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-foreground">{shipping === 0 ? "Free" : formatKD(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Taxes</dt>
              <dd className="text-foreground">{formatKD(0)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-bold text-foreground">Total</dt>
              <dd className="font-extrabold text-foreground">{formatKD(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
