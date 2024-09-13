import dataModels from "./models";

async function countDocs(modelName, filter = {}) {
  if (!dataModels[modelName]) {
    return new Error("Model not found");
  }
  return dataModels[modelName].countDocuments(filter);
}

export { countDocs };
