import dataModels from "./models";
import { stringifyObjectIdFromObj } from "./utilsDB";
import mongoose from "mongoose";
import { unstable_cache } from "next/cache";
if (mongoose.connection.readyState === 0) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.log(e.message);
  }
}

/**
 * cache tags used for revalidateTag. use these to realidate cached data.
 * @example ["getOneDoc", "getManyDocs", "flights", flightNumber, "airlines", "airplanes", "airports", "seats", "userDetails", "flightReviews", flightNumber + "_reviews", reviewer + "_reviews"]
 */

// function is catched in production
async function getOneDoc(modelName, filter = {}, tags = [], revalidationTime) {
  async function getData(mdlName, fltr) {
    try {
      const doc = await dataModels[mdlName].findOne(fltr);
      return stringifyObjectIdFromObj(doc?.toObject() || {});
    } catch (error) {
      throw error;
    }
  }

  if (process.env.NODE_ENV === "production") {
    return unstable_cache(
      async () => getData(modelName, filter),
      ["getOneDoc", modelName, JSON.stringify(filter)],
      {
        revalidate: +process.env.REVALIDATION_TIME || revalidationTime || 600,
        tags: ["getOneDoc", ...tags],
      }
    )();
  } else {
    return getData(modelName, filter);
  }
}

async function getManyDocs(
  modelName,
  filter = {},
  tags = [],
  revalidationTime
) {
  async function getData(mdlName, fltr) {
    try {
      return (await dataModels[mdlName].find(fltr).exec()).map((doc) => {
        return stringifyObjectIdFromObj(doc.toObject());
      });
    } catch (error) {
      throw error;
    }
  }

  if (process.env.NODE_ENV === "production") {
    return unstable_cache(
      async () => getData(modelName, filter),
      ["getManyDocs", modelName, JSON.stringify(filter)],
      {
        revalidate: +process.env.REVALIDATION_TIME || revalidationTime || 600,
        tags: ["getManyDocs", ...tags],
      }
    )();
  } else {
    return getData(modelName, filter);
  }
}

export { getOneDoc, getManyDocs };
