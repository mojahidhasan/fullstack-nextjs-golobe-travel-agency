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
    if (!!!searchQuery) {
      return Response.json({ success: true, data: airports });
    }

    const regex = new RegExp(
      `${searchQuery.match(/.{1,2}/g).join("+?.*")}`,
      "i"
    );

    const filteredAirports = airports.filter((airport) => {
      return (
        regex.test(airport.iataCode) ||
        regex.test(airport.name) ||
        regex.test(airport.city)
      );
    });

    return Response.json({ success: true, data: filteredAirports });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}
