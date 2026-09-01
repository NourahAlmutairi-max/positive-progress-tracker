import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <p className="text-sm font-extrabold tracking-tight text-foreground">TECH PREMIUM</p>
          <p className="mt-3 text-xs text-muted-foreground">
            © 2026 TECH PREMIUM. All rights reserved.
          </p>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Support</p>
          <Link to="/about" className="block hover:text-primary">
            Contact us
          </Link>
          <Link to="/about" className="block hover:text-primary">
            Shipping
          </Link>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Company</p>
          <Link to="/about" className="block hover:text-primary">
            Terms of Service
          </Link>
          <Link to="/about" className="block hover:text-primary">
            Privacy Policy
          </Link>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Global Store</p>
          <p>Kuwait · Prices in KD</p>
          <p>Sustainability</p>
        </div>
      </div>
    </footer>
  );
}
