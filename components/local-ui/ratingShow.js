import { Button } from "../ui/button";
export function RatingShow({ rating }) {
  return (
    <Button variant="outline" size="sm" className="rounded-lg px-3 py-1">
      {rating}
    </Button>
  );
}
