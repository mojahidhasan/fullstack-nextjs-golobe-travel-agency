import { Map } from "@/components/pages/hotels.[slug]/sections/Map";
import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import Link from "next/link";
import location from "@/public/icons/location.svg";
import { getOneDoc, getManyDocs } from "@/lib/db/getOperationDB";
import { RATING_SCALE } from "@/lib/constants";
import { RatingShow } from "@/components/local-ui/ratingShow";
import { LikeButton } from "@/components/local-ui/likeButton";
import { auth } from "@/lib/auth";
import FlightOrHotelReview from "@/components/sections/FlightOrHotelReview";
import { getUserDetails } from "@/lib/services/user";
import { formatCurrency, groupBy } from "@/lib/utils";
import { Dropdown } from "@/components/local-ui/Dropdown";
import RoomDetailsModal from "@/components/pages/hotels.[slug]/sections/RoomDetailsModal";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { View, X } from "lucide-react";
import { notFound } from "next/navigation";
import { strToObjectId } from "@/lib/db/utilsDB";
import { hotelPriceCalculation } from "@/lib/helpers/hotels/priceCalculation";
import { getHotel } from "@/lib/services/hotels";
import { cookies } from "next/headers";
import validateHotelSearchParams from "@/lib/zodSchemas/hotelSearchParams";
import NotFound from "@/app/not-found";
import routes from "@/data/routes.json";
export default async function HotelDetailsPage({ params }) {
  const session = await auth();
  const slug = params.slug;

  const searchState = JSON.parse(
    cookies().get("hotelSearchState")?.value || "{}",
  );
  const validate = validateHotelSearchParams(searchState);

  if (!validate.success)
    return (
      <NotFound
        whatHappened="Error in search state"
        explanation="Sorry, we couldn't retrieve your hotel search context or there was an error in search state. Thus we couldn't retrieve the hotel details. Please search again."
        navigateTo={{ path: routes.hotels.path, title: routes.hotels.title }}
      />
    );

  const hotelDetails = await getHotel(slug, searchState);

  if (Object.keys(hotelDetails).length === 0) return notFound();

  const reviews = await getManyDocs(
    "HotelReview",
    { hotelId: strToObjectId(hotelDetails._id), slug },
    [hotelDetails._id + "_review", params.slug + "_review", "hotelReviews"],
  );

  const totalRatingsSum = reviews.reduce(
    (acc, review) => acc + +review.rating,
    0,
  );
  const totalReviewsCount = reviews.length;

  const rating = totalRatingsSum / totalReviewsCount;
  const ratingScale = RATING_SCALE[Math.floor(rating)];

  const roomsSorted = [...hotelDetails.rooms].sort((a, b) => {
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
  });
  const cheapestRoom = roomsSorted[0];

  const price = hotelPriceCalculation(cheapestRoom.price, 1);

  const cheapestRoomPrice = formatCurrency(price.total);
  const totalBeforeDiscount = formatCurrency(price.totalBeforeDiscount);

  let isLiked = false;
  if (session?.user) {
    const userDetails = await getUserDetails(session?.user?.id);
    isLiked = userDetails?.hotels?.bookmarked?.includes(hotelDetails._id);
  }

  const groupByRoomType = groupBy(roomsSorted, (room) => room.roomType);

  return (
    <main className={"mx-auto mb-[90px] mt-10 w-[90%]"}>
      <BreadcrumbUI />
      <div className="my-[40px] flex flex-col items-center justify-between gap-5 sm:flex-row">
        <div>
          <div className="mb-[16px] flex items-center gap-[16px]">
            <h1 className="text-[1.5rem] font-bold text-secondary">
              {hotelDetails.name}
            </h1>
          </div>
          <p className="mb-[8px] text-[0.75rem] font-medium">
            <Image className="inline" src={location} alt="location_icon" />{" "}
            <span className="opacity-75">
              {hotelDetails.address.streetAddress +
                ", " +
                hotelDetails.address.city +
                ", " +
                hotelDetails.address.stateProvince +
                " " +
                hotelDetails.address.postalCode +
                ", " +
                hotelDetails.address.country}
            </span>
          </p>
          <div className="flex items-center gap-1 text-[0.75rem]">
            <RatingShow rating={rating} />
            <p className="font-bold">
              {totalReviewsCount ? ratingScale : "N/A"}
            </p>
            <p>{totalReviewsCount} reviews</p>
          </div>
        </div>
        <div>
          <div className="mb-[16px] flex flex-col text-right text-[0.875rem] font-bold text-tertiary sm:items-end">
            {Boolean(+price.discountPercentage) && (
              <p className="w-fit rounded-md bg-tertiary px-2 py-1 text-sm font-semibold text-white">
                {price.discountPercentage}% OFF
              </p>
            )}
            <div className="space-x-2 max-sm:text-left">
              {totalBeforeDiscount !== cheapestRoomPrice && (
                <>
                  <span className="text-base font-semibold text-black line-through">
                    {totalBeforeDiscount}
                  </span>
                </>
              )}
              <span className="text-[2rem]">{cheapestRoomPrice}</span>
              /night
            </div>
          </div>
          <div className="flex flex-col gap-[16px] sm:flex-row">
            <LikeButton
              keys={{ hotelId: hotelDetails._id }}
              isBookmarked={isLiked}
              flightOrHotel="hotel"
            />
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M13.1866 13.915L13.2024 13.9239L13.215 13.9107C13.4455 13.6697 13.7225 13.4778 14.0292 13.3468C14.336 13.2158 14.6661 13.1483 14.9996 13.1484C15.5168 13.1484 16.0211 13.3103 16.4417 13.6114C16.8622 13.9126 17.1779 14.3378 17.3445 14.8275C17.511 15.3172 17.5201 15.8468 17.3704 16.3419C17.2206 16.837 16.9197 17.2728 16.5097 17.5881C16.0997 17.9034 15.6012 18.0825 15.0843 18.1001C14.5673 18.1178 14.0578 17.9731 13.6273 17.6865C13.1968 17.3998 12.8668 16.9855 12.6837 16.5018C12.5005 16.0181 12.4735 15.4891 12.6062 14.9892L12.6109 14.9717L12.5951 14.9628L6.81383 11.71L6.798 11.7011L6.78543 11.7142C6.44333 12.0709 6.00234 12.3171 5.51918 12.4211C5.03602 12.5251 4.5328 12.4822 4.07425 12.2978C3.6157 12.1135 3.22279 11.7961 2.94607 11.3866C2.66935 10.9771 2.52148 10.4942 2.52148 10C2.52148 9.50578 2.66935 9.02286 2.94607 8.61336C3.22279 8.20387 3.6157 7.88654 4.07425 7.70218C4.5328 7.51783 5.03602 7.47489 5.51918 7.57889C6.00234 7.68289 6.44333 7.92907 6.78543 8.28575L6.798 8.29887L6.81383 8.28996L12.5951 5.03722L12.6109 5.02832L12.6062 5.01076C12.4516 4.4303 12.5139 3.81338 12.7815 3.27558C13.0491 2.73777 13.5036 2.31598 14.0599 2.08922C14.6161 1.86246 15.236 1.8463 15.8033 2.04376C16.3706 2.24122 16.8465 2.63875 17.1418 3.16188C17.437 3.68501 17.5314 4.29784 17.4073 4.88557C17.2831 5.4733 16.9489 5.9956 16.4673 6.35462C15.9857 6.71364 15.3897 6.88475 14.791 6.83589C14.1923 6.78703 13.6319 6.52155 13.2149 6.0892L13.2023 6.07616L13.1866 6.08504L7.4053 9.33778L7.38947 9.34668L7.39415 9.36423C7.50508 9.78082 7.50508 10.2192 7.39415 10.6358L7.38947 10.6533L7.4053 10.6622L13.1866 13.915Z"
                  fill="black"
                  stroke="#112211"
                  strokeWidth="0.046875"
                />
              </svg>
            </Button>
            <Button asChild>
              <Link href={`/hotels/${params.slug}/book`}>Book now</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="relative mb-[40px] grid w-auto grid-cols-4 grid-rows-2 gap-[8px] overflow-hidden rounded-[12px] max-lg:aspect-video lg:h-[500px]">
        {hotelDetails.images.length > 0 && (
          <Image
            height={1000}
            className="col-span-2 row-span-2 h-full w-full object-cover object-center"
            src={hotelDetails.images[0]}
            alt=""
            width={1000}
          />
        )}
        {hotelDetails.images.length > 1 &&
          hotelDetails.images
            .slice(1, 5)
            .map((image) => (
              <Image
                key={image}
                height={1000}
                className="h-full w-full object-cover object-center"
                src={image}
                alt=""
                width={1000}
              />
            ))}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              size={"icon"}
              className={"absolute bottom-[8px] right-[8px]"}
            >
              <View />
            </Button>
          </DialogTrigger>
          <DialogContent
            close={false}
            className="h-[90vh] max-w-[90%] items-center border-0 bg-transparent"
          >
            <DialogClose
              asChild
              className="absolute right-[16px] top-[16px] rounded-md border-2 border-white text-white"
            >
              <X />
            </DialogClose>
            <Carousel
              options={{
                autoPlay: false,
              }}
              className="mx-auto max-w-[80%] sm:max-w-[90%]"
            >
              <CarouselContent>
                {hotelDetails.images.length > 0 &&
                  hotelDetails.images.map((img, i) => (
                    <CarouselItem
                      key={img}
                      className="flex h-full w-full items-center justify-center"
                    >
                      <Image
                        key={img}
                        src={img}
                        alt={`Hotel image ${i + 1}`}
                        width={1000}
                        height={1000}
                        className="aspect-video h-full rounded-lg object-cover"
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </DialogContent>
        </Dialog>
      </div>
      <Separator className="my-[40px]" />
      <div>
        <h2 className="mb-[16px] text-2xl font-bold">Overview</h2>
        <p className="mb-[32px] font-medium opacity-75">
          {hotelDetails.description}
        </p>
        <div className="golobe-scrollbar flex gap-[16px] overflow-x-auto pb-3">
          <div className="h-[145px] min-w-[160px] whitespace-nowrap rounded-[12px] bg-primary p-[16px]">
            <p className="mb-[32px] text-[2rem] font-bold">
              {totalReviewsCount ? rating.toFixed(1) : "N/A"}
            </p>
            <p className="font-bold">
              {totalReviewsCount ? ratingScale : "N/A"}
            </p>
            <p className="text-[0.875rem] font-medium">
              {totalReviewsCount} reviews
            </p>
          </div>
          {hotelDetails.features.slice(0).map((feature) => (
            <div
              key={feature}
              className="flex h-[145px] min-w-[160px] flex-col justify-between rounded-[12px] border border-primary p-[16px]"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.9999 31.9999C12.6839 32.0016 12.3749 31.9067 12.1142 31.728C11.8535 31.5493 11.6536 31.2953 11.5411 30.9999L9.05113 24.5249C9.0007 24.3945 8.92355 24.276 8.82464 24.1771C8.72573 24.0781 8.60723 24.001 8.47676 23.9506L1.99988 21.4587C1.70485 21.3455 1.45108 21.1454 1.27208 20.885C1.09308 20.6246 0.997252 20.316 0.997252 19.9999C0.997252 19.6839 1.09308 19.3753 1.27208 19.1149C1.45108 18.8545 1.70485 18.6544 1.99988 18.5412L8.47488 16.0512C8.60536 16.0008 8.72385 15.9236 8.82277 15.8247C8.92168 15.7258 8.99883 15.6073 9.04926 15.4768L11.5411 8.99995C11.6544 8.70491 11.8544 8.45115 12.1148 8.27215C12.3753 8.09314 12.6839 7.99732 12.9999 7.99732C13.3159 7.99732 13.6245 8.09314 13.8849 8.27215C14.1454 8.45115 14.3454 8.70491 14.4586 8.99995L16.9486 15.4749C16.9991 15.6054 17.0762 15.7239 17.1751 15.8228C17.274 15.9217 17.3925 15.9989 17.523 16.0493L23.9605 18.5262C24.2676 18.64 24.5321 18.8457 24.7181 19.1152C24.904 19.3847 25.0024 19.705 24.9999 20.0324C24.9951 20.343 24.8973 20.6449 24.719 20.8992C24.5407 21.1535 24.2902 21.3484 23.9999 21.4587L17.5249 23.9487C17.3944 23.9991 17.2759 24.0763 17.177 24.1752C17.0781 24.2741 17.0009 24.3926 16.9505 24.5231L14.4586 30.9999C14.3462 31.2953 14.1462 31.5493 13.8856 31.728C13.6249 31.9067 13.3159 32.0016 12.9999 31.9999V31.9999ZM5.49988 10.9999C5.3146 10.9999 5.13368 10.9438 4.98094 10.8389C4.8282 10.734 4.71082 10.5854 4.64426 10.4124L3.59051 7.67245C3.56767 7.61252 3.53242 7.5581 3.48707 7.51276C3.44173 7.46741 3.38731 7.43216 3.32738 7.40932L0.587382 6.35557C0.414494 6.289 0.26583 6.17161 0.160977 6.01887C0.0561237 5.86613 0 5.68521 0 5.49995C0 5.31468 0.0561237 5.13377 0.160977 4.98103C0.26583 4.82829 0.414494 4.7109 0.587382 4.64432L3.32738 3.59057C3.38725 3.56763 3.44161 3.53235 3.48695 3.48701C3.53228 3.44168 3.56756 3.38731 3.59051 3.32745L4.63488 0.611824C4.69378 0.451951 4.79513 0.31115 4.92805 0.204555C5.06096 0.0979598 5.22041 0.0296006 5.38926 0.00682422C5.59197 -0.0178194 5.79712 0.0259172 5.97216 0.131099C6.14719 0.23628 6.28211 0.396886 6.35551 0.587449L7.40926 3.32745C7.4322 3.38731 7.46748 3.44168 7.51282 3.48701C7.55815 3.53235 7.61252 3.56763 7.67238 3.59057L10.4124 4.64432C10.5853 4.7109 10.7339 4.82829 10.8388 4.98103C10.9436 5.13377 10.9998 5.31468 10.9998 5.49995C10.9998 5.68521 10.9436 5.86613 10.8388 6.01887C10.7339 6.17161 10.5853 6.289 10.4124 6.35557L7.67238 7.40932C7.61246 7.43216 7.55804 7.46741 7.51269 7.51276C7.46734 7.5581 7.4321 7.61252 7.40926 7.67245L6.35551 10.4124C6.28895 10.5854 6.17157 10.734 6.01883 10.8389C5.86609 10.9438 5.68516 10.9999 5.49988 10.9999V10.9999ZM24.9999 15.9999C24.7978 15.9999 24.6004 15.9386 24.4338 15.8241C24.2672 15.7096 24.1393 15.5474 24.0668 15.3587L22.6393 11.6481C22.6141 11.5827 22.5756 11.5233 22.526 11.4738C22.4765 11.4243 22.4171 11.3857 22.3518 11.3606L18.6411 9.93307C18.4526 9.86043 18.2905 9.7324 18.1762 9.56583C18.0619 9.39926 18.0007 9.20198 18.0007 8.99995C18.0007 8.79792 18.0619 8.60063 18.1762 8.43407C18.2905 8.2675 18.4526 8.13946 18.6411 8.06682L22.3518 6.63932C22.4171 6.61421 22.4765 6.57564 22.526 6.52612C22.5756 6.47659 22.6141 6.41721 22.6393 6.35182L24.0561 2.66745C24.1208 2.49322 24.2315 2.33978 24.3765 2.22345C24.5214 2.10713 24.6952 2.03226 24.8793 2.00682C25.1005 1.98005 25.3243 2.02792 25.5152 2.14285C25.7061 2.25777 25.8531 2.43317 25.933 2.6412L27.3605 6.35182C27.3856 6.41721 27.4242 6.47659 27.4737 6.52612C27.5232 6.57564 27.5826 6.61421 27.648 6.63932L31.3586 8.06682C31.5471 8.13946 31.7092 8.2675 31.8236 8.43407C31.9379 8.60063 31.9991 8.79792 31.9991 8.99995C31.9991 9.20198 31.9379 9.39926 31.8236 9.56583C31.7092 9.7324 31.5471 9.86043 31.3586 9.93307L27.648 11.3606C27.5826 11.3857 27.5232 11.4243 27.4737 11.4738C27.4242 11.5233 27.3856 11.5827 27.3605 11.6481L25.933 15.3587C25.8605 15.5474 25.7325 15.7096 25.5659 15.8241C25.3994 15.9386 25.202 15.9999 24.9999 15.9999Z"
                  fill="black"
                />
              </svg>
              <p className="font-medium">{feature}</p>
            </div>
          ))}
        </div>
      </div>
      <Separator className="my-[40px]" />
      <div>
        <h2 className="mb-[32px] text-2xl font-bold">Available Rooms</h2>
        <div className="space-y-6">
          {Object.entries(groupByRoomType).map(([roomType, rooms]) => {
            const groupByBedOptions = groupBy(rooms, (room) => room.bedOptions);

            return (
              <Dropdown
                key={roomType}
                open={roomType === "Budget Room"}
                title={roomType}
              >
                <div className="space-y-4 p-4">
                  {Object.entries(groupByBedOptions).map(([key, arr]) => {
                    const oneEquivalentRoom = arr[0];
                    const price = hotelPriceCalculation(
                      oneEquivalentRoom.price,
                      1,
                    );
                    return (
                      <RoomDetailsModal
                        key={key}
                        roomDetails={oneEquivalentRoom}
                        customTriggerElement={
                          <div
                            key={key}
                            className="group flex items-center justify-between rounded-md border-b p-1 pb-4 hover:bg-gray-100"
                          >
                            <div className="flex items-center gap-4">
                              <Image
                                src={oneEquivalentRoom.images[0]}
                                alt="Room image"
                                width={64}
                                height={64}
                                className="aspect-square rounded-md object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium group-hover:underline">
                                  {oneEquivalentRoom.bedOptions}
                                </p>
                                <p className="text-xs font-bold opacity-60">
                                  {formatCurrency(price.total)} / night
                                </p>
                                <p className="text-xs opacity-60">
                                  Person capacity:{" "}
                                  {oneEquivalentRoom.sleepsCount}
                                </p>
                                <p className="text-xs opacity-60">
                                  Available rooms: {arr.length}
                                </p>
                              </div>
                            </div>
                            <div>
                              {Boolean(price.discountPercentage) && (
                                <p className="rounded-md bg-tertiary p-1 font-bold text-white">
                                  {price.discountPercentage}% OFF
                                </p>
                              )}
                            </div>
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              </Dropdown>
            );
          })}
        </div>
      </div>
      <Separator className="my-[64px]" />
      <div>
        <div className="mb-[32px] flex items-center justify-between">
          <h2 className="text-2xl font-bold">Location/Map</h2>
        </div>
        <div>
          <Map
            lat={+hotelDetails.coordinates.lat}
            lon={+hotelDetails.coordinates.lon}
            address={
              hotelDetails.address.streetAddress +
              ", " +
              hotelDetails.address.city +
              ", " +
              hotelDetails.address.country
            }
          />
        </div>
      </div>
      <Separator className="my-[40px]" />
      <div>
        <h2 className="mb-[32px] text-2xl font-bold">Amenities</h2>
        <div>
          <ul className="grid grid-cols-2 gap-[24px]">
            {hotelDetails.amenities.map((amenity) => (
              <li
                key={amenity}
                className="flex items-center gap-[8px] font-semibold"
              >
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Separator className="my-[40px]" />
      <FlightOrHotelReview reviewType="hotel" data={hotelDetails} />
    </main>
  );
}
