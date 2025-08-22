import "server-only";
import { Analytic } from "../db/models";
import { countDocs } from "../db/utilsDB";

export async function createAnalytics() {
  const hasAnalytics = await Analytic.exists({ _id: "analytics" });

  if (!hasAnalytics) {
    const totalUsers = await countDocs("User", {});
    await Analytic.create({
      totalUsersSignedUp: totalUsers,
    });
  }
}

export async function incOrDecrementAnalytics(data) {
  return await Analytic.updateOne(
    {
      _id: "analytics",
    },
    { $inc: data },
  );
}
