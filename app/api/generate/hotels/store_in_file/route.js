import { generateHotelsDB } from "@/lib/db/generateForDB/hotels/generateHotels";
import fs from "fs/promises";
export async function POST(req) {
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
    return Response.json({
      success: true,
      message: "Hotels files generated successfully",
    });
  } catch (e) {
    console.log(e);
    return Response.json(
      { success: false, message: "Error generating files" },
      { status: 500 },
    );
  }
}
