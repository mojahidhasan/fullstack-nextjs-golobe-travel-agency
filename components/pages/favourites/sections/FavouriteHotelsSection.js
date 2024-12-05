import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";

export function FavouriteHotelsSection({ favouriteHotels }) {
  if (favouriteHotels.length < 1) {
    return (
      <h1
        className={
          "text-[1.25rem] py-20 h-full font-semibold text-secondary text-center bg-white rounded-md shadow-md"
        }
      >
        No favourite hotels
      </h1>
    );
  }
  return (
    <div>
      <h1>Favourite hotels</h1>
    </div>
  );
}
