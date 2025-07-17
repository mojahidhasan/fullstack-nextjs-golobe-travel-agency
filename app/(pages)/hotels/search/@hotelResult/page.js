import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { auth } from "@/lib/auth";
import { RATING_SCALE } from "@/lib/constants";
import { getUserDetails } from "@/lib/controllers/user";
import validateHotelSearchParams from "@/lib/zodSchemas/hotelSearchParams";
import SetHotelFormState from "@/components/helpers/SetHotelFormState";
import { getHotels } from "@/lib/controllers/hotels";
import Jumper from "@/components/local-ui/Jumper";
import { hotelPriceCalculation } from "@/lib/helpers/hotels/priceCalculation";
export default async function HotelResultPage({ searchParams }) {
  let hotels = [];
  let filters = {};
  const session = await auth();

  if (Object.keys(searchParams).length > 0) {
    const destination = searchParams.destination;
    const checkIn = searchParams.checkIn;
    const checkOut = searchParams.checkOut;
    const guests = searchParams.guests;
    const rooms = searchParams.rooms;

    if (searchParams?.filters) {
      filters = JSON.parse(searchParams.filters);
      hotels = await getManyDocs(
        "Hotel",
        {
          query: {
            $regex: `${destination.match(/.{1,2}/g).join("+?.*")}`,
            $options: "i",
          },
          ...(filters?.features &&
            filters?.features.length > 0 && {
              features: {
                $in: filters.features.map(
                  (feature) => feature.split("feature-")[1],
                ),
              },
            }),
          ...(filters?.amenities &&
            filters?.amenities.length > 0 && {
              amenities: {
                $in: filters.amenities.map(
                  (amenity) => amenity.split("amenity-")[1],
                ),
              },
            }),
        },
        ["hotels"],
      );
    } else {
      hotels = await getManyDocs(
        "Hotel",
        {
          query: {
            $regex: `${destination.match(/.{1,2}/g).join("+?.*")}`,
            $options: "i",
          },
        },
        ["hotels"],
      );
    }
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
        0,
      );

      return totalSleepsCount >= Number(guests);
    });
    // show liked hotels if user is logged in
    if (session?.user?.id) {
      const userDetails = await getUserDetails(session?.user?.id);

      hotels = hotels.map((hotel) => {
        const liked = userDetails?.likes?.hotels.includes(hotel._id);
        return { ...hotel, liked };
      });
    }
  }

  // rating and reviews
  hotels = await Promise.all(
    hotels.map(async (hotel) => {
      const reviews = await getManyDocs(
        "HotelReview",
        { hotelId: hotel._id, slug: hotel.slug },
        [hotel._id + "_review", hotel.slug + "_review", "hotelReviews"],
      );
      const totalRatingsSum = reviews.reduce(
        (acc, review) => acc + +review.rating,
        0,
      );
      const totalReviewsCount = reviews.length;

      const rating = totalRatingsSum / totalReviewsCount;
      const ratingScale = RATING_SCALE[Math.floor(rating)];

      const cheapestRoom = [...hotel.rooms].sort((a, b) => {
        const aPrice = hotelPriceCalculation(a.price, 1);
        const bPrice = hotelPriceCalculation(b.price, 1);

        return aPrice.total - bPrice.total;
      })[0];

      return {
        _id: hotel._id,
        slug: hotel.slug,
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
    }),
  );

  if (hotels?.length < 1) {
    return <div className={"grow text-center font-bold"}>No data found</div>;
  }

  return (
    <div className="flex flex-grow flex-col gap-[32px]">
      {hotels.map((hotel) => (
        <HotelResultCard
          key={hotel._id}
          hotel={hotel}
          searchState={validate.data}
        />
      ))}
    </div>
  );
}
