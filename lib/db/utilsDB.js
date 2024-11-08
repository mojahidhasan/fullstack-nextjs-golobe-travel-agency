import { Schema, isValidObjectId } from "mongoose";
import dataModels from "./models";
/**
 * Count number of documents in a model
 *
 * @param {String} modelName - name of the model to be counted, Should be Capitalized and singular
 * @param {Object} filter - filter object , `{ key: value }`
 * @returns {Promise<Number>}
 * @example
 *
 * await countDocs("User", {name: "John"})
 */
async function countDocs(modelName = "User", filter = {}) {
  if (!dataModels[modelName]) {
    return new Error("Model not found");
  }
  return dataModels[modelName].countDocuments(filter);
}

// find object id recursivelly in childrens and stringify them

function stringifyObjectIdFromObj(object) {
  if (object === null || typeof object !== "object") return object;

  if (isValidObjectId(object)) {
    return object.toString();
  }

  if (Array.isArray(object)) {
    return object.map((el) => stringifyObjectIdFromObj(el));
  }

  for (const [key, value] of Object.entries(object)) {
    if (isValidObjectId(value)) {
      object[key] = value.toString();
    } else if (typeof value === "object" && value !== null) {
      object[key] = stringifyObjectIdFromObj(value);
    }
  }

  return object;
}

export { countDocs, stringifyObjectIdFromObj };
