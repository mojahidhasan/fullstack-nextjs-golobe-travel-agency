"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SelectShadcn as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RatingStar } from "@/components/local-ui/ratingStar";
import { Input } from "../local-ui/input";
import submitWebsiteReviewsAction from "@/lib/actions/submitWebsiteReviewsAction";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";

export default function WebsiteReviewForm() {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("overall");
  const [comment, setComment] = useState("");

  const [errors, setErrors] = useState({});

  const categories = [
    { value: "customer_support", label: "Customer Support" },
    { value: "pricing", label: "Pricing" },
    { value: "reliability", label: "Reliability" },
    { value: "communication", label: "Communication" },
    { value: "overall", label: "Overall" },
  ];

  const handleSubmit = async (e) => {
    e.target.disabled = true;
    const reviewData = { rating, category, comment };
    const res = await submitWebsiteReviewsAction(reviewData);
    e.target.disabled = false;

    if (!res.success) {
      setErrors(res.error || {});
      return toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    }

    setRating(0);
    setCategory("overall");
    setComment("");
    setErrors({});
    return toast({
      title: "Success",
      description: res.message,
    });
  };

  return (
    <Card className="mx-auto mt-6 max-w-md rounded-2xl shadow-lg">
      <CardContent className="space-y-4 p-6">
        <h2
          id="website_review_form_title"
          className="text-center text-xl font-semibold"
        >
          Share Your Website Experience
        </h2>

        {/* Rating */}
        <div className="flex justify-center space-x-1">
          <RatingStar
            width={32}
            height={32}
            onValueChange={setRating}
            fill="#ffd700"
            error={errors.rating}
            defaultRating={rating}
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              className={cn(
                "mt-1 w-full border-2 border-black",
                errors.category && "border-destructive",
              )}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="pl-3 text-sm font-medium text-destructive">
            {errors.category}
          </p>
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium">Comment (optional)</label>
          <Input
            name="comment"
            label=""
            error={errors.comment}
            type="textarea"
            maxLength={1000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            className="mt-1"
          />
        </div>

        {/* Submit */}
        <Button onClick={handleSubmit} className="mt-4 w-full">
          Submit Review
        </Button>
      </CardContent>
    </Card>
  );
}
