import { generateHotelsDB } from "@/lib/db/generateForDB/hotels/generateHotels";
import fs from "fs/promises";
export async function GET(req) {
  if (
    req.headers.get("Authorization") !==
    `Bearer ${process.env.API_SECRET_TOKEN}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const data = await generateHotelsDB();
    await fs.mkdir("./generated/hotels", { recursive: true });
    for (const [key, value] of Object.entries(data)) {
      await fs.writeFile(
        `./generated/hotels/${key}.json`,
        JSON.stringify(value, null, 2),
      );
    }
    console.log("Hotels files generated successfully");
    return new Response("Hotels files generated successfully", { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response("Error generating hotel files", { status: 500 });
  }
}
