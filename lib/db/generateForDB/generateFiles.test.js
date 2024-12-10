import { expect, test } from "vitest";
import { generateDBData } from ".";
import fs from "fs/promises";

test("generateDBFiles", { timeout: 2 * 60 * 1000 }, async () => {
  const data = await generateDBData();
  fs.mkdir("./generated", { recursive: true });
  for (const [key, value] of Object.entries(data)) {
    await fs.writeFile(
      `./generated/${key}.json`,
      JSON.stringify(value, null, 2)
    );
  }

  console.log("done");
  expect(true).toBe(true);
});
