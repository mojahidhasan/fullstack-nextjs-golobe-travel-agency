import { unstable_cache } from "next/cache";
import { getUser } from "../getOperationDB";

const getUserCatched = unstable_cache(async (id) => getUser(id), ["user"], {
  revalidate: +process.env.REVALIDATION_TIME,
  tags: ["user"],
});

export { getUserCatched };
