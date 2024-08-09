import { unstable_cache } from "next/cache";
import { getUserById, getUserDetailsByUserId } from "../getOperationDB";

const getUserByIdCatched = unstable_cache(
  async (id) => getUserById(id),
  ["user"],
  {
    revalidate: +process.env.REVALIDATION_TIME,
    tags: ["user"],
  }
);

const getUserDetailsByUserIdCatched = unstable_cache(
  async (useId) => getUserDetailsByUserId(useId),
  ["user_details"],
  {
    revalidate: +process.env.REVALIDATION_TIME,
    tags: ["user_details"],
  }
);

export { getUserByIdCatched, getUserDetailsByUserIdCatched };
