"use server";
import { revalidateTag } from "next/cache";
import { auth } from "../auth";
import { isObject, isValidJSON } from "../utils";
import { z } from "zod";
import { createOneDoc } from "../db/createOperationDB";

export default async function submitWebsiteReviewsAction(formData) {
  const session = await auth();
  if (!session?.user) return { success: false, message: "Unauthenticated" };

  const data =
    formData instanceof FormData
      ? Object.fromEntries(formData)
      : isValidJSON(formData)
        ? JSON.parse(formData)
        : isObject(formData)
          ? formData
          : { ...formData };

  const validatedData = z
    .object({
      rating: z
        .number()
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
      category: z
        .string()
        .min(1, "Category is required")
        .transform((val, ctx) => {
          if (
            ![
              "customer_support",
              "pricing",
              "reliability",
              "communication",
              "overall",
            ].includes(val)
          ) {
            return ctx.addIssue({
              code: "custom",
              message: "Invalid category",
            });
          }
          return val;
        }),
      comment: z
        .string()
        .min(1, "Comment is required")
        .max(500, "Comment is too long"),
    })
    .safeParse(data);

  if (!validatedData.success) {
    const errors = {};
    validatedData.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    return { success: false, message: "Error in form data", error: errors };
  }

  const { rating, category, comment } = validatedData.data;

  try {
    await createOneDoc("WebsiteReview", {
      userId: session.user.id,
      rating,
      category,
      comment,
    });

    return { success: true, message: "Review submitted successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error in creating review" };
  } finally {
    revalidateTag("websiteReviews");
    revalidateTag("websiteReviewsStats");
    revalidateTag(`${session.user.id}_hasAlreadyReviewed`);
  }
}
