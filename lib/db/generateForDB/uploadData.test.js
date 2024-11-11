import { expect, test } from "vitest";
import uploadDataToDB from "./generateEvery";

test("generateDB", { timeout: 2 * 60 * 1000 }, async () => {
  await uploadDataToDB();
  expect(true).toBe(true);
});
