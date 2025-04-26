import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { AuthenticationCard } from "@/components/AuthenticationCard";
import { isLoggedIn } from "@/lib/auth";
import { objDeepCompare, parseFlightSearchParams } from "@/lib/utils";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getFlight } from "@/lib/controllers/flights";
import { getUserDetails } from "@/lib/controllers/user";
import SessionTimeoutCountdown from "@/components/local-ui/SessionTimeoutCountdown";
import { getManyDocs } from "@/lib/db/getOperationDB";
import BookingSteps from "@/components/pages/flights.book/BookingSteps";
export default async function FlightBookPage({ params }) {
  const loggedIn = await isLoggedIn();
  const searchStateCookie = cookies().get("searchState")?.value || "{}";
  const parsedSearchState = parseFlightSearchParams(searchStateCookie);
  const timeZone = cookies().get("timeZone")?.value || "UTC";
  const flightClass = cookies().get("flightClass")?.value || "economy";
  const metaData = { timeZone, flightClass, isBookmarked: false };
  const airlinePrices = await getManyDocs("AirlineFlightPrice", {}, [
    "airlinePrices",
  ]);

  const flight = await getFlight(
    {
      flightNumber: params.flightNumber,
      flightClass: parsedSearchState?.flightClass || flightClass,
      passengersObj: parsedSearchState?.passengers,
    },
    airlinePrices,
  );

  if (Object.keys(flight).length === 0) {
    notFound();
  }

  if (loggedIn) {
    const userDetails = await getUserDetails(0);
    metaData.isBookmarked = userDetails.flights.bookmarked.some((el) => {
      return objDeepCompare(el, {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        flightClass: metaData.flightClass,
      });
    });
  }

  return (
    <>
      <main className="mx-auto mb-[80px] mt-[40px] w-[90%] text-secondary">
        <BreadcrumbUI />

        <div className="mt-[30px] flex gap-[20px] max-lg:flex-col-reverse lg:gap-[30px] xl:gap-[40px]">
          <div>
            <FlightsSchedule flight={flight} />
            <div className="mb-[20px] rounded-[12px] bg-white p-[16px] shadow-lg lg:mb-[30px] xl:mb-[40px]">
              <RadioGroup defaultValue="Pay_in_full">
                <Label className="flex rounded-[12px] justify-between p-[16px] has-[[data-state='checked']]:bg-primary grow items-center gap-[32px]">
                  <div>
                    <p className="font-bold mb-2">Pay in full</p>
                    <p className="text-[0.875rem]">
                      Pay the total and you are all set
                    </p>
                  </div>
                  <RadioGroupItem
                    className="data-[state='checked']:text-white border-2 data-[state='checked']:border-white"
                    value="Pay_in_full"
                  />
                </Label>
                <Label className="flex rounded-[12px] justify-between p-[16px] has-[[data-state='checked']]:bg-primary grow items-center gap-[32px]">
                  <div>
                    <p className="font-bold mb-2">Pay part now, part later</p>
                    <p className="text-[0.875rem]">
                      Pay ${parseFloat(flightInfo.totalPrice / 2).toFixed(2)}{" "}
                      now, and the rest ($
                      {parseFloat(flightInfo.totalPrice / 2).toFixed(2)}) will
                      be automatically charged to the same payment method on{" "}
                      {halfPaymentChargingDate}. No extra fees.
                    </p>
                  </div>
                  <RadioGroupItem
                    className="data-[state='checked']:text-white border-2 data-[state='checked']:border-white"
                    value="Pay_part"
                  />
                </Label>
              </RadioGroup>
              <p className="p-[16px]">
                <Link scroll={false} href="#" className="underline">
                  More info
                </Link>
              </p>
            </div>

            <div className="rounded-12px bg-white p-16px shadow-small">
              {isLoggedIn ? <ChoosePaymentCard /> : <AuthenticationCard />}
            </div>
          </div>
          <div className="h-min flex-grow rounded-12px bg-white p-24px shadow-small">
            <FareCard
              name={flightInfo.airplaneName}
              fare={{
                price: flightInfo.price,
                totalPrice: flightInfo.totalPrice,
              }}
              reviews={flightInfo.reviews}
              rating={flightInfo.rating}
              imgSrc={flightInfo.imgSrc}
              type={capitalize(FLIGHT_CLASS_PLACEHOLDERS[flightClass])}
            />
          </div>
        </div>
      </main>
    </>
  );
}
