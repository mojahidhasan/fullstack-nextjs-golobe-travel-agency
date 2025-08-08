import { createManyDocs } from "@/lib/db/createOperationDB";
import { deleteManyDocs } from "@/lib/db/deleteOperationDB";
import { generateHotelsDB } from "@/lib/db/generateForDB/hotels/generateHotels";

export async function POST(req) {
  if (
    req.headers.get("Authorization") !==
    `Bearer ${process.env.API_SECRET_TOKEN}`
  ) {
    return new Response("401", { status: 401 });
  }

  try {
    console.log("Uploading hotels DB...");
    await uploadHotelsDB();
    console.log("Hotels DB uploaded successfully.");
    return Response.json({
      success: true,
      message: "Hotels DB uploaded successfully.",
    });
  } catch (error) {
    console.error("Error uploading hotels DB:", error);
    return Response.json(
      {
        success: false,
        message: "Error uploading hotels DB",
      },
      { status: 500 },
    );
  }
}

async function uploadHotelsDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not found in .env file.");
  }

  const datas = await generateHotelsDB();
  console.log(datas.hotelRoom[0]);
  try {
    for (const [key, value] of Object.entries(datas)) {
      await deleteManyDocs(key);
      console.log("deleted", key);
      // create
      await createManyDocs(key, value);
      console.log("created", key);
    }
  } catch (error) {
    console.error("Error deleting Hotel documents:", error);
  }

  return true;
}
