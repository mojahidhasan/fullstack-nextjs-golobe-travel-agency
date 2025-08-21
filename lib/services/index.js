import "server-only";
import { unstable_cache } from "next/cache";
import { User, WebsiteReview } from "../db/models";
import { bucketizeNumber } from "../utils";
import { getManyDocs } from "../db/getOperationDB";

/**
 * Fetches a list of website reviews from the database.
 *
 * @async
 * @function getWebsiteReviews
 * @param {number} [limit=10] - The number of reviews to fetch. Defaults to 10.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of website review objects.
 * Each review object has the following properties:
 * - id: The ID of the review (string).
 * - reviewer: The name of the person who made the review (string).
 * - profileImage: The URL of the user's profile image (string).
 * - rate: The rating of the review (number).
 * - comment: The comment of the review (string).
 */
export async function getWebsiteReviews(limit = 10) {
  async function getReviews() {
    const docs = await WebsiteReview.aggregate([{ $sample: { size: limit } }]);

    const mappedPromises = docs.map(async (doc) => {
      const result = {};
      const user = await User.findOne({ _id: doc.userId });

      result.id = doc._id.toString();
      result.reviewer = user?.firstName || "Golobe User";
      result.profileImage = user?.profileImage || "";
      result.rate = doc.rating;
      result.comment = doc.comment;

      return result;
    });

    return Promise.all(mappedPromises);
  }

  const cachedReviews = unstable_cache(
    async () => getReviews(),
    ["websiteReviews"],
    {
      tags: ["websiteReviews"],
      revalidate: Number.MAX_SAFE_INTEGER,
    },
  );

  return cachedReviews();
}

/**
 * @typedef {Object} Stats
 * @property {number} totalReviews - The total number of website reviews.
 * @property {number} averageRating - The average rating of website reviews.
 * @property {number} fiveStarReviews - The number of 5-star website reviews.
 * @property {number} satisfactionRate - The satisfaction rate of website reviews.
 */

/**
 * Retrieves statistics about website reviews.
 *
 * @return {Promise<Stats>} An object containing the total number of reviews,
 * average rating, number of 5-star reviews, and satisfaction rate.
 */
export async function getWebsiteReviewsStats() {
  const stats = await unstable_cache(
    () =>
      WebsiteReview.aggregate([
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
            fiveStarReviews: {
              $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
            },
            satisfiedReviews: {
              $sum: {
                $cond: [{ $in: ["$rating", [4, 5]] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalReviews: 1,
            averageRating: { $round: ["$averageRating", 2] },
            fiveStarReviews: 1,
            satisfiedReviews: 1,
            satisfactionRate: {
              $cond: [
                { $eq: ["$totalReviews", 0] },
                0,
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$satisfiedReviews", "$totalReviews"] },
                        100,
                      ],
                    },
                    0,
                  ],
                },
              ],
            },
          },
        },
      ]),
    ["websiteReviewsStats"],
    {
      revalidate: Number.MAX_SAFE_INTEGER,
      tags: ["websiteReviewsStats"],
    },
  )();

  const result = {
    satisfiedReviews: "N/A",
    totalReviews: "N/A",
    averageRating: "N/A",
    fiveStarReviews: "N/A",
    satisfactionRate: "N/A",
  };

  if (stats[0]) {
    result.satisfiedReviews = bucketizeNumber(+stats[0].satisfiedReviews) + "+";
    result.totalReviews = bucketizeNumber(+stats[0].totalReviews) + "+";
    result.averageRating = (+stats[0].averageRating).toFixed(1);
    result.fiveStarReviews = bucketizeNumber(+stats[0].fiveStarReviews) + "+";
    result.satisfactionRate = stats[0].satisfactionRate + "%";
  }

  return result;
}

/**
 * Retrieves the recent searches for a given user and type.
 *
 * @param {string} userId - The ID of the user.
 * @param {'flight' | 'hotel'} type - The type of search (flight or hotel).
 * @param {number} [limit=10] - The maximum number of searches to retrieve. Defaults to 10.
 * @return {Promise<Array>} An array of recent search documents.
 */
export async function getRecentSearches(userId, type, limit = 10) {
  const docs = await getManyDocs(
    "SearchHistory",
    { userId, type },
    [`${userId}_${type}_searchHistory`],
    Number.MAX_SAFE_INTEGER,
    {
      sort: { createdAt: -1 },
      limit,
    },
  );

  return docs;
}
