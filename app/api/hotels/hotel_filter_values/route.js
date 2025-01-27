import { Hotel } from "@/lib/db/models";

export async function GET(req) {
  try {
    const hotels = await Hotel.find({})
      .select("-_id amenities features rooms")
      .exec();

    // eslint-disable-next-line no-undef
    const amenities = new Set(hotels.flatMap((hotel) => hotel.amenities));
    // eslint-disable-next-line no-undef
    const features = new Set(hotels.flatMap((hotel) => hotel.features));

    const allPrices = hotels
      .flatMap((hotel) => hotel.rooms)
      .map((room) => {
        return (
          +room.price.base +
          +room.price.tax -
          +room.price.discount +
          +room.price.serviceFee
        );
      });
    return Response.json({
      amenities: Array.from(amenities).sort((a, b) => a.localeCompare(b)),
      features: Array.from(features).sort((a, b) => a.localeCompare(b)),
      minPrice: Math.floor(Math.min(...allPrices)),
      maxPrice: Math.floor(Math.max(...allPrices)),
    });
  } catch (error) {
    return Response.json({ error: error.message });
  }
}
