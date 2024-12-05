import { FlightResultCard } from "@/components/pages/flights.search/ui/FlightResultCard";

export function FavouriteFlightListSection({ favouriteFlights }) {
  if (favouriteFlights.length < 1) {
    return (
      <h1
        className={
          "text-[1.25rem] py-20 h-full font-semibold text-secondary text-center bg-white rounded-md shadow-md"
        }
      >
        No favourite flights
      </h1>
    );
  }
  return (
    <div className={"grid grid-cols-1 mb-5 gap-[16px] sm:max-md:grid-cols-2"}>
      {favouriteFlights.map((flight, i) => {
        return (
          <FlightResultCard
            key={flight._id}
            data={flight}
            liked={flight.liked}
          />
        );
      })}
    </div>
  );
}
