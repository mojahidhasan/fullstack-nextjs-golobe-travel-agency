import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";
import { getManyDocs, getOneDoc } from "@/lib/db/getOperationDB";
import { auth } from "@/lib/auth";
import { RATING_SCALE } from "@/lib/constants";
export default async function HotelResultPage({ searchParams }) {
  let hotels = [];

  const session = await auth();

  if (Object.keys(searchParams).length > 0) {
    const destination = searchParams.destination;
    const checkIn = searchParams.checkIn;
    const checkOut = searchParams.checkOut;
    const guests = searchParams.guests;
    const rooms = searchParams.rooms;

    hotels = await getManyDocs("Hotel", {
      query: {
        $regex: new RegExp(`${destination.match(/.{1,2}/g).join("+?.*")}`, "i"),
      },
    });

    // filter by total available rooms sleeps count is greater than or equal to number of guests
    hotels = hotels.filter((hotel) => {
      const availableHotelRoomsByDate = hotel.rooms.filter((room) => {
        // check if room is available in the particular date
        const isRoomAvailable = room.availability.every((availability) => {
          return (
            new Date(availability.willCheckedOut) >= new Date(checkIn) &&
            new Date(availability.checkedIn) <= new Date(checkOut)
          );
        });
        return isRoomAvailable;
      });

      const totalSleepsCount = availableHotelRoomsByDate.reduce(
        (acc, room) => acc + +room.sleepsCount,
        0
      );

      return totalSleepsCount >= Number(guests);
    });

    // show liked hotels if user is logged in
    if (session?.user?.id) {
      const userDetails = await getOneDoc("User", { _id: session?.user?.id });

      hotels = hotels.map((hotel) => {
        const liked = userDetails?.likes?.hotels.includes(hotel._id);
        return { ...hotel, liked };
      });
    }
  }

  // rating and reviews
  hotels = hotels.map((hotel) => {
    const totalRatingsSum = hotel.reviews.reduce(
      (acc, review) => acc + +review.rating,
      0
    );
    const totalReviewsCount = hotel.reviews.length;

    const rating = totalRatingsSum / totalReviewsCount;
    const ratingScale = RATING_SCALE[Math.floor(rating)];

    const cheapestRoom = [...hotel.rooms].sort(
      (a, b) => a.price.base - b.price.base
    )[0];
    return {
      _id: hotel._id,
      name: hotel.name,
      address: Object.values(hotel.address).join(", "),
      amenities: hotel.amenities.slice(0, 5),
      price: cheapestRoom.price,
      availableRooms: hotel.rooms.length,
      rating: totalReviewsCount ? rating.toFixed(1) : "N/A",
      totalReviews: totalReviewsCount,
      ratingScale: ratingScale || "N/A",
      image: hotel.images[0],
      liked: hotel.liked,
    };
  });
  return (
    <div className="flex flex-grow flex-col gap-[32px]">
      {hotels.map((hotel) => (
        <HotelResultCard key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
}
