import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";

export const createCheckoutSession = createServerFn({
  method: "POST",
}).handler(async () => {
  const secretKey = process.env["STRIPE_SECRET_KEY"];
  const priceId = process.env["STRIPE_PRICE_ID"];

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID is not configured.");
  }

  const stripe = new Stripe(secretKey);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    success_url:
      "https://positive-progress-tracker.vercel.app/?payment=success",

    cancel_url:
      "https://positive-progress-tracker.vercel.app/checkout?payment=cancelled",
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return {
    url: session.url,
    sessionId: session.id,
  };
});
