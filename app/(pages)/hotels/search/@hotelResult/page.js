import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { auth } from "@/lib/auth";
import { RATING_SCALE } from "@/lib/constants";
import { getUserDetails } from "@/lib/controllers/user";
import validateHotelSearchParams from "@/lib/zodSchemas/hotelSearchParams";
import SetHotelFormState from "@/components/helpers/SetHotelFormState";
export default async function HotelResultPage({ searchParams }) {
  let hotels = [];
  let filters = {};
  const session = await auth();

  const validate = validateHotelSearchParams(searchParams);

  if (validate.success === false) {
    return <SetHotelFormState obj={{ errors: validate.errors }} />;
  }
  const city = validate.data.city;
  const country = validate.data.country;
  const checkIn = validate.data.checkIn;
  const checkOut = validate.data.checkOut;
  const rooms = validate.data.rooms;
  const guests = validate.data.guests;

  hotels = await getManyDocs(
    "Hotel",
    {
      "address.city": {
        $regex: `${city.match(/.{1,2}/g).join("+?.*")}`,
        $options: "i",
      },
      "address.country": {
        $regex: `${country.match(/.{1,2}/g).join("+?.*")}`,
        $options: "i",
      },
    },
    ["hotels"],
  );

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

    return (
      totalSleepsCount >= Number(guests) &&
      availableHotelRoomsByDate.length >= Number(rooms)
    );
  });
  // show liked hotels if user is logged in
  if (session?.user?.id) {
    const userDetails = await getUserDetails(session?.user?.id);

    hotels = hotels.map((hotel) => {
      const liked = userDetails?.hotels?.bookmarked?.includes(hotel._id);
      return { ...hotel, liked };
    });
  }

  // rating and reviews
  hotels = await Promise.all(
    hotels
      .map(async (hotel) => {
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
          const aPrice =
            +a.price.base +
            +a.price.tax -
            +a.price.discount +
            +a.price.serviceFee;
          const bPrice =
            +b.price.base +
            +b.price.tax -
            +b.price.discount +
            +b.price.serviceFee;
          return aPrice - bPrice;
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
      })
      .filter((hotel) => {
        let rateFilter = true;
        let priceFilter = true;
        if (filters?.rate && filters?.rate.length > 0) {
          const rating = hotel.rating === "N/A" ? 0 : +hotel.rating;
          rateFilter = filters?.rate.map(Number).includes(Math.floor(rating));
        }

        if (filters?.priceRange?.length > 1) {
          const price =
            +hotel.price.base +
            +hotel.price.tax -
            +hotel.price.discount +
            +hotel.price.serviceFee;
          if (
            price <= +filters?.priceRange[0] ||
            price >= +filters?.priceRange[1]
          ) {
            priceFilter = false;
          }
        }
        return rateFilter && priceFilter;
      }),
  );

  if (hotels?.length < 1) {
    return <div className={"grow text-center font-bold"}>No data found</div>;
  }

  return (
    <div className="flex flex-grow flex-col gap-[32px]">
      {hotels.map((hotel) => (
        <HotelResultCard key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
}
