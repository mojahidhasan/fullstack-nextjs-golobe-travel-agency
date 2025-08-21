import { SectionTitle } from "@/components/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Award, TrendingUp } from "lucide-react";
import WebsiteReviewForm from "@/components/sections/WebsiteReviewForm";
import { auth } from "@/lib/auth";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { WebsiteReviewsList } from "./WebsiteReviewsList";
import { getWebsiteReviews, getWebsiteReviewsStats } from "@/lib/services";

export async function Reviews() {
  const session = await auth();
  const userId = session?.user?.id;

  const userReview = await getOneDoc(
    "WebsiteReview",
    { userId },
    [`${userId}_hasAlreadyReviewed`],
    24 * 60 * 60,
  );

  const isAuthenticated = !!session?.user;
  const hasAlreadyReviewed = Object.keys(userReview).length > 0;

  const reviews = await getWebsiteReviews();
  const { satisfiedReviews, averageRating, fiveStarReviews, satisfactionRate } =
    await getWebsiteReviewsStats();

  return (
    <section className="relative mx-auto mb-[80px] overflow-hidden px-4">
      {/* Background decoration */}
      <div className="to-primary/3 absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent"></div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-16">
          <SectionTitle
            title="Customer Reviews"
            subTitle="Discover what our valued customers say about their Golobe experience"
          />

          {/* Enhanced Statistics */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-3 flex items-center justify-center">
                  <div className="rounded-full bg-primary/20 p-3">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900">
                  {averageRating}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Average Rating
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-green-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-3 flex items-center justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900">
                  {satisfiedReviews}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Satisfied Customers
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-yellow-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-3 flex items-center justify-center">
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900">
                  {satisfactionRate}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Satisfaction Rate
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-3 flex items-center justify-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mb-1 text-3xl font-bold text-gray-900">
                  {fiveStarReviews}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  5-Star Reviews
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mb-12">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/30 bg-primary/10 px-4 py-2 font-semibold"
                >
                  Customer Reviews
                </Badge>
                <span className="text-sm font-medium text-gray-600">
                  Showing {reviews.length} verified customer reviews
                </span>
              </div>
            </div>
            <WebsiteReviewsList reviews={reviews} />
          </div>
        )}

        {/* Website Review Form for Logged-in Users */}
        {isAuthenticated && !hasAlreadyReviewed && (
          <div className="mt-16">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Share Your Experience
              </h3>
              <p className="text-gray-600">
                Help us improve by sharing your feedback about our website
              </p>
            </div>
            <WebsiteReviewForm />
          </div>
        )}
      </div>
    </section>
  );
}
