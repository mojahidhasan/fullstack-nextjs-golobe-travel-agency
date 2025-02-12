import { generateFlightsDB } from "./generateFlights";
import { createManyDocs } from "../../createOperationDB";
import { deleteManyDocs } from "../../deleteOperationDB";
import mongoose from "mongoose";
import { test, expect } from "vitest";
async function uploadFlightsDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env file.");
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.log(e.message);
    }
  }

  const datas = await generateFlightsDB();

  for (const [key, value] of Object.entries(datas)) {
    await deleteManyDocs(key);
    console.log("deleted", key);
    // create
    await createManyDocs(key, value);
    console.log("created", key);
  }

  return true;
}

test("generateAndUploadFlightsDB", { timeout: 2 * 60 * 1000 }, async () => {
  await uploadFlightsDB();
  expect(true).toBe(true);
});
