import { Airport } from "@/lib/db/models";

export async function GET(req) {
  const searchParams = Object.fromEntries(new URL(req.url).searchParams);
  const limit = searchParams?.limit || 10;
  const searchQuery = searchParams?.searchQuery;

  const airports = await Airport.find({})
    .limit(limit)
    .select("iataCode name city -_id")
    .exec();

  try {
    if (!searchQuery || searchQuery.trim() === "") {
      return Response.json({
        success: true,
        message: "Available airports fetched successfully",
        data: airports,
      });
    }

    const searchLower = searchQuery.toLowerCase().trim();

    const filteredAirports = airports.filter((airport) => {
      return (
        airport.iataCode?.toLowerCase().includes(searchLower) ||
        airport.name?.toLowerCase().includes(searchLower) ||
        airport.city?.toLowerCase().includes(searchLower)
      );
    });

    return Response.json({
      success: true,
      message: "Available airports fetched successfully",
      data: filteredAirports,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
