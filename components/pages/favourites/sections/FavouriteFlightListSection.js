import { FlightResultCard } from "@/components/pages/flights.search/ui/FlightResultCard";

export function FavouriteFlightListSection({ favouriteFlights }) {
  if (favouriteFlights.length < 1) {
    return (
      <h1
        className={
          "h-full rounded-md bg-white py-20 text-center text-[1.25rem] font-semibold text-secondary shadow-md"
        }
      >
        No favourite flights
      </h1>
    );
  }
  return (
    <div className={"mb-5 grid grid-cols-1 gap-[16px]"}>
      {favouriteFlights.map((flight, i) => {
        return (
          <FlightResultCard
            key={flight._id}
            data={flight}
            searchState={flight.searchState}
            metaData={flight.metaData}
          />
        );
      })}
    </div>
  );
}
