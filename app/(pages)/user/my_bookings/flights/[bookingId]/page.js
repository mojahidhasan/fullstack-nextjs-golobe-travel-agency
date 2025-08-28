import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import airlinesLogos from "@/data/airlinesLogos";
import calender from "@/public/icons/calender-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";
import timer from "@/public/icons/timer-mint.svg";
import airplaneIcon from "@/public/icons/airplane-filled-mint.svg";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { cn, minutesToHMFormat } from "@/lib/utils";
import routes from "@/data/routes.json";
import { auth } from "@/lib/auth";
import Link from "next/link";
import NoSSR from "@/components/helpers/NoSSR";
import ShowTimeInClientSide from "@/components/helpers/ShowTimeInClientSide";
import { strToObjectId } from "@/lib/db/utilsDB";
import { allowedFlightBookingActionBtns } from "@/lib/helpers/flights/allowedHotelBookingActionBtns";
import {
  BOOKING_STATUS_BG_COL_TW_CLASS,
  BOOKING_STATUS_TEXT_COL_TW_CLASS,
  PAYMENT_STATUS_BG_TW_CLASS,
  PAYMENT_STATUS_TEXT_COL_TW_CLASS,
} from "@/lib/constants";
import RequestRefundFlightBtn from "@/components/pages/profile/ui/RequestRefundFlightBtn";
import CancelFlightBtn from "@/components/pages/profile/ui/CancelFlightBtn";
export default async function FlightBookingDetailsPage({ params }) {
  const session = await auth();
  const loggedIn = !!session?.user;
  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent("/user/my_bookings/flights/" + params.bookingId),
    );
  }
  const bookingId = params.bookingId;
  const bookingData = await getOneDoc(
    "FlightBooking",
    {
      _id: strToObjectId(bookingId),
      userId: strToObjectId(session.user.id),
    },
    ["userFlightBooking"],
  );

  if (Object.keys(bookingData).length === 0) return notFound();

  const flightData = await getOneDoc(
    "FlightItinerary",
    {
      _id: strToObjectId(bookingData.flightItineraryId),
    },
    ["flight"],
  );

  const bookingDetails = {
    key: bookingData._id,
    pnrCode: bookingData.pnrCode,
    bookingStatus: bookingData.ticketStatus,
    paymentStatus: bookingData.paymentStatus,
    itineraryFlightNumber: flightData.flightCode,
    passengers: bookingData.passengers.map((p) => {
      const seatDetails = bookingData.selectedSeats.find(
        (s) => s.passengerId === p._id,
      );
      return {
        key: p._id,
        fullName: p.firstName + " " + p.lastName,
        passengerType: p.passengerType,
        seatNumber: seatDetails.seatId.seatNumber,
        seatClass: seatDetails.seatId.class,
      };
    }),
    segments: flightData.segmentIds.map((s) => {
      return {
        key: s._id,
        flightNumber: s.flightNumber,
        airplaneModelName: s.airplaneId.model,
        airlineName: s.airlineId.name,
        airlineIataCode: s.airlineId.iataCode,
        departureDateTime: s.from.scheduledDeparture,
        departureAirportIataCode: s.from.airport.iataCode,
        departureAirportName: s.from.airport.name,
        arrivalDateTime: s.to.scheduledArrival,
        arrivalAirportIataCode: s.to.airport.iataCode,
        arrivalAirportName: s.to.airport.name,
        flightDurationMinutes: s.durationMinutes,
        gate: s.from.gate,
        terminal: s.from.terminal,
      };
    }),
  };

  const cancellationPolicy =
    flightData.carrierInCharge.airlinePolicy.cancellationPolicy;

  const { canCancel, canRefund, canDownload, canPay, canConfirm } =
    allowedFlightBookingActionBtns(
      bookingDetails.bookingStatus,
      bookingDetails.paymentStatus,
      cancellationPolicy,
      bookingDetails.segments[0].departureDateTime,
    );
  return (
    <main className="container mx-auto max-w-6xl px-6 py-12">
      <section className="mb-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <InfoCard
            title="Flight Number"
            value={bookingDetails.itineraryFlightNumber}
          />
          <InfoCard title="PNR" value={bookingData.pnrCode} />
          <InfoCard title="Status" value={bookingData.ticketStatus} status />
          <InfoCard
            title="Payment Status"
            value={bookingData.paymentStatus}
            status
          />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-lg font-semibold">Flight Details</h2>
        {bookingDetails.segments.map((s) => (
          <div key={s.key} className="mb-6 rounded-md border bg-white p-4">
            <div className="mb-6 flex flex-wrap justify-between gap-2">
              <div className="mb-3 flex gap-4">
                <Image
                  src={airlinesLogos[s.airlineIataCode]}
                  alt="Airline Logo"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg border border-primary object-contain p-2"
                />
                <div>
                  <h1 className="text-2xl font-bold">{s.airlineName}</h1>
                  <p className="text-muted-foreground">{s.airlineIataCode}</p>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{s.flightNumber}</h1>
                <p className="text-muted-foreground">{s.airplaneModelName}</p>
              </div>
            </div>
            <div className="mb-6 flex flex-col justify-between gap-10 md:flex-row">
              <FlightTimeDetails
                label="Departure"
                time={s.departureDateTime}
                airportName={s.departureAirportName}
                airportIataCode={s.departureAirportIataCode}
              />
              <FlightTimeDetails
                label="Arrival"
                time={s.arrivalDateTime}
                airportName={s.arrivalAirportName}
                airportIataCode={s.arrivalAirportIataCode}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              <IconDataCard
                icon={calender}
                label="Date"
                value={
                  <NoSSR>
                    <ShowTimeInClientSide
                      date={s.departureDateTime}
                      formatStr="d MMM yyyy"
                    />
                  </NoSSR>
                }
              />
              <IconDataCard
                icon={timer}
                label="Duration"
                value={minutesToHMFormat(s.flightDurationMinutes)}
              />
              <IconDataCard icon={gate} label="Gate" value={s.gate} />
              <IconDataCard
                icon={airplaneIcon}
                label="Terminal"
                value={s.terminal}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Passenger Information</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookingData.passengers.map((p) => {
            const seat = bookingData.selectedSeats.find(
              (s) => s.passengerId === p._id,
            );
            return (
              <div
                key={p._id}
                className="rounded border bg-white p-4 shadow-sm"
              >
                <p className="font-medium">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-sm capitalize text-muted-foreground">
                  Type: {p.passengerType}
                </p>
                <p className="text-sm capitalize text-muted-foreground">
                  Seat class: {p.seatClass}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap justify-start gap-4">
        {canPay && (
          <Button className={"min-w-[100px]"} asChild>
            <Link
              href={`/user/my_bookings/flights/${bookingDetails.key}/payment`}
            >
              Pay
            </Link>
          </Button>
        )}
        {canDownload && (
          <Button className="text-wrap" addYears>
            <Link
              href={`/user/my_bookings/flights/${bookingDetails.key}/ticket`}
            >
              Download Ticket
            </Link>
          </Button>
        )}
        {canCancel && <CancelFlightBtn pnrCode={bookingDetails.pnrCode} />}
        {canRefund && (
          <RequestRefundFlightBtn pnrCode={bookingDetails.pnrCode} />
        )}
      </section>
    </main>
  );
}

function InfoCard({ title, value, status = false }) {
  return (
    <div
      className={cn(
        `rounded border bg-white p-4`,
        status && BOOKING_STATUS_BG_COL_TW_CLASS[value],
        status && BOOKING_STATUS_TEXT_COL_TW_CLASS[value],
        status && PAYMENT_STATUS_BG_TW_CLASS[value],
        status && PAYMENT_STATUS_TEXT_COL_TW_CLASS[value],
      )}
    >
      <p className="text-xs uppercase text-muted-foreground">{title}</p>
      <p className={`mt-1 text-sm font-medium capitalize`}>{value}</p>
    </div>
  );
}

function IconDataCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded border bg-white p-4">
      <Image src={icon} width={32} height={32} alt={`${label} icon`} />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function FlightTimeDetails({ label, time, airportName, airportIataCode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">
        <NoSSR>
          <ShowTimeInClientSide date={time} formatStr="hh:mm aaa" />
        </NoSSR>
      </p>
      <p className="text-sm">
        <NoSSR>
          <ShowTimeInClientSide date={time} formatStr="d MMM yyyy" />
        </NoSSR>
      </p>
      <p className="text-xs text-muted-foreground">
        {airportName} ({airportIataCode})
      </p>
    </div>
  );
}

export async function generateMetadata({ params }) {
  return {
    title: `Booking #${params.bookingId} - Flight Details`,
    description: `Detailed information for flight booking ID ${params.bookingId}.`,
  };
}
