import { Button } from "../ui/button";
export function RatingShow({ rating }) {
  return (
    <Button variant="outline" size="sm" className="rounded-lg px-3 py-1">
      {Number.isInteger(rating) && Math.floor(rating) > 0
        ? rating.toFixed(1)
        : "N/A"}
    </Button>
  );
}
