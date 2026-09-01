import { Star } from "lucide-react";

export function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex" aria-label={`Rated ${rating} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`size-4 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
          />
        ))}
      </div>
      {reviews !== undefined && (
        <span className="text-xs text-muted-foreground">
          {rating} ({reviews} reviews)
        </span>
      )}
    </div>
  );
}
