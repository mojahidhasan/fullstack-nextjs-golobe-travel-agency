import mongoose from "mongoose";
import { deleteManyDocs } from "../../deleteOperationDB";
import { createManyDocs } from "../../createOperationDB";
import { expect, test } from "vitest";
import { generateHotelsDB } from "./generateHotel";
async function uploadHotels() {
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

  const datas = await generateHotelsDB();

  for (const [key, value] of Object.entries(datas)) {
    await deleteManyDocs(key);
    console.log("deleted", key);
    // create
    await createManyDocs(key, value);
    console.log("created", key);
  }

  return true;
}

test("uploadHotelsDB", { timeout: 2 * 60 * 1000 }, async () => {
  try {
    await uploadHotels();
    expect(true).toBe(true);
  } catch (e) {
    console.log(e);
  }
});
