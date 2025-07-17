import dataModels from "./models";
import { connectToDB, stringifyObjectIdFromObj } from "./utilsDB";
import { unstable_cache } from "next/cache";

await connectToDB();

/**
 * cache tags used for revalidateTag. use these to realidate cached data.
 * @example ["getOneDoc", "getManyDocs", "flights", flightNumber, "airlines", "airplanes", "airports", "seats", "userDetails", "userAccount", "flightReviews", " flightNumber + "_review", reviewer + "_review", flightReviewId + "_review"]
 */

// function is catched in production
async function getOneDoc(
  modelName,
  filter = {},
  tags = [],
  revalidationTime,
  options = {},
) {
  const revalidate =
    revalidationTime > 0 || revalidationTime === false
      ? revalidationTime
      : +process.env.NEXT_PUBLIC_REVALIDATION_TIME || 600;

  async function getData(mdlName, fltr, opt) {
    try {
      if (!dataModels[mdlName])
        throw new Error(`"${mdlName}" is not a valid model`);
      const doc = await dataModels[mdlName].findOne(
        fltr,
        opt?.projection || null,
        opt,
      );

      return stringifyObjectIdFromObj(doc?.toObject() || {});
    } catch (error) {
      throw error;
    }
  }

  if (
    process.env.NODE_ENV === "production" &&
    (revalidationTime !== false || revalidationTime > 0)
  ) {
    return unstable_cache(
      async () => getData(modelName, filter, options),
      ["getOneDoc", modelName, JSON.stringify(filter), JSON.stringify(options)],
      {
        revalidate,
        tags: ["getOneDoc", ...tags],
      },
    )();
  } else {
    return getData(modelName, filter, options);
  }
}

async function getManyDocs(
  modelName,
  filter = {},
  tags = [],
  revalidationTime,
  options = {},
) {
  const revalidate =
    revalidationTime > 0 || revalidationTime === false
      ? revalidationTime
      : +process.env.NEXT_PUBLIC_REVALIDATION_TIME || 600;
  async function getData(mdlName, fltr, opt) {
    try {
      return (
        await dataModels[mdlName]
          .find(fltr, opt?.projection || null, opt)
          .exec()
      ).map((doc) => {
        return stringifyObjectIdFromObj(doc.toObject());
      });
    } catch (error) {
      throw error;
    }
  }

  if (
    process.env.NODE_ENV === "production" &&
    (revalidationTime !== false || revalidationTime > 0)
  ) {
    return unstable_cache(
      async () => getData(modelName, filter, options),
      ["getManyDocs", modelName, JSON.stringify(filter)],
      {
        revalidate,
        tags: ["getManyDocs", ...tags],
      },
    )();
  } else {
    return getData(modelName, filter, options);
  }
}

export { getOneDoc, getManyDocs };
