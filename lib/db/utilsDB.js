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

export { countDocs };
