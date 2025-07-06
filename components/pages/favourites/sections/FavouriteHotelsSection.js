import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";

export function FavouriteHotelsSection({ favouriteHotels }) {
  if (favouriteHotels.length < 1) {
    return (
      <h1
        className={
          "h-full rounded-md bg-white py-20 text-center text-[1.25rem] font-semibold text-secondary shadow-md"
        }
      >
        No favourite hotels
      </h1>
    );
  }
  return (
    <div className={"mb-5 grid grid-cols-1 gap-[16px] sm:max-md:grid-cols-2"}>
      {favouriteHotels.map((hotel, i) => {
        return <HotelResultCard key={hotel._id} hotel={hotel} />;
      })}
    </div>
  );
}
