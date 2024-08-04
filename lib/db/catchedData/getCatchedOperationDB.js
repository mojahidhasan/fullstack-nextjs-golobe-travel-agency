import { unstable_cache } from "next/cache";
import { getUserById } from "../getOperationDB";

const getUserCatched = unstable_cache(async (id) => getUserById(id), ["user"], {
  revalidate: +process.env.REVALIDATION_TIME,
  tags: ["user"],
});

export { getUserCatched };
