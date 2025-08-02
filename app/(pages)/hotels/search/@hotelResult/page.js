import { HotelResultCard } from "@/components/pages/hotels.search/ui/HotelResultCard";
import { getManyDocs } from "@/lib/db/getOperationDB";
import { auth } from "@/lib/auth";
import { RATING_SCALE } from "@/lib/constants";
import { getUserDetails } from "@/lib/controllers/user";
import validateHotelSearchParams from "@/lib/zodSchemas/hotelSearchParams";
import SetHotelFormState from "@/components/helpers/SetHotelFormState";
import { getHotels } from "@/lib/controllers/hotels";
import Jumper from "@/components/local-ui/Jumper";
import extractFiltersObjFromSearchParams from "@/lib/helpers/hotels/extractFiltersObjFromSearchParams";
import validateHotelSearchFilter from "@/lib/zodSchemas/hotelSearchFilterValidation";
export default async function HotelResultPage({ searchParams }) {
  let filters = extractFiltersObjFromSearchParams(searchParams);
  const validatedFilters = validateHotelSearchFilter(filters);

  const session = await auth();

  const validate = validateHotelSearchParams(searchParams);

  const formStateError = {
    ...searchParams,
    checkIn: new Date(searchParams.checkIn)?.toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    checkOut: new Date(searchParams.checkOut)?.toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    destination: { city: searchParams.city, country: searchParams.country },
    errors: validate.errors,
  };
  delete formStateError.city;
  delete formStateError.country;

  if (validate.success === false) {
    return <SetHotelFormState obj={formStateError} />;
  }

  let hotels = await getHotels(validate.data, {
    filters: validatedFilters?.data,
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
  const hotelResultsForCard = await Promise.all(
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
        let aDiscountAmount = 0;
        let bDiscountAmount = 0;

        if (a.price.discount.type === "percentage") {
          aDiscountAmount = a.price.base * (+a.price.discount.amount / 100);
        } else {
          aDiscountAmount = +a.price.discount.amount;
        }
        if (b.price.discount.type === "percentage") {
          bDiscountAmount = b.price.base * (+b.price.discount.amount / 100);
        } else {
          bDiscountAmount = +b.price.discount.amount;
        }

        const aPrice =
          +a.price.base + +a.price.tax - aDiscountAmount + +a.price.serviceFee;
        const bPrice =
          +b.price.base + +b.price.tax - bDiscountAmount + +b.price.serviceFee;

        return aPrice - bPrice;
      })[0];

      return {
        _id: hotel._id,
        slug: hotel.slug,
        name: hotel.name,
        address: Object.values(hotel.address).join(", "),
        amenities: hotel.amenities.slice(0, 5),
        price: cheapestRoom.price,
        availableRoomsCount: hotel.rooms.length,
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
      <Jumper id={"hotelResults"} />
      {hotelResultsForCard.map((hotel) => (
        <HotelResultCard
          key={hotel._id}
          hotel={hotel}
          searchState={validate.data}
        />
      ))}
    </div>
  );
}
