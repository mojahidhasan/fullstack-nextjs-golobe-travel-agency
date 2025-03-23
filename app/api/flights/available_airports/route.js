import { Airport } from "@/lib/db/models";
export async function GET(req) {
  const searchParams = Object.fromEntries(new URL(req.url).searchParams);
  const limit = searchParams?.limit || 10;
  const searchQuery = searchParams?.searchQuery;

  const airports = await Airport.find({})
    .limit(limit)
    .select("iataCode name city state country -_id")
    .exec();
  try {
    if (!!!searchQuery) {
      return Response.json(airports);
    }

    const regex = new RegExp(
      `${searchQuery.match(/.{1,2}/g).join("+?.*")}`,
      "i"
    );

    const filteredAirports = airports.filter((airport) => {
      return (
        regex.test(airport.iataCode) ||
        regex.test(airport.name) ||
        regex.test(airport.city) ||
        regex.test(airport.state) ||
        regex.test(airport.country)
      );
    });

    return Response.json(filteredAirports);
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
