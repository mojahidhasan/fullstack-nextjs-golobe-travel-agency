import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { addYears } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import airlinesLogos from "@/data/airlinesLogos";
import calender from "@/public/icons/calender-mint.svg";
import gate from "@/public/icons/door-closed-mint.svg";
import timer from "@/public/icons/timer-mint.svg";
import airplaneIcon from "@/public/icons/airplane-filled-mint.svg";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { cn, minutesToHMFormat } from "@/lib/utils";
import routes from "@/data/routes.json";
import { isLoggedIn } from "@/lib/auth";
export default async function FlightBookingDetailsPage({ params }) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent("/user/my_bookings/flights/" + params.bookingRef),
    );
  }

  const bookingId = params.bookingRef;
  const bookingData = await getOneDoc("FlightBooking", {
    bookingRef: bookingId,
  });

  if (Object.keys(bookingData).length === 0) return notFound();

  const flight = bookingData.flightSnapshot;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = Date.now();
  const canCancel = now < addYears(new Date(), 1).getTime();
  const canRefund =
    bookingData.bookingStatus === "canceled" &&
    bookingData.paymentStatus === "paid" &&
    now < new Date(2026);

  return (
    <main className="container mx-auto max-w-6xl px-6 py-12">
      <section className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-6">
          <Image
            src={airlinesLogos[flight.airlineId.iataCode]}
            alt="Airline Logo"
            width={64}
            height={64}
            className="rounded border p-2"
          />
          <div>
            <h1 className="text-2xl font-bold">{flight.airlineId.name}</h1>
            <p className="text-muted-foreground">{flight.airplaneId.model}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <InfoCard title="Flight Number" value={flight.flightNumber} />
          <InfoCard title="PNR" value={bookingData.bookingRef} />
          <InfoCard title="Status" value={bookingData.bookingStatus} status />
        </div>

        <div className="mt-6 flex flex-col justify-between gap-10 md:flex-row">
          <FlightTimeDetails
            label="Departure"
            time={flight.departure.scheduled}
            airport={flight.departure.airport}
            tz={tz}
          />
          <FlightTimeDetails
            label="Arrival"
            time={flight.arrival.scheduled}
            airport={flight.arrival.airport}
            tz={tz}
          />
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <IconDataCard
          icon={calender}
          label="Date"
          value={formatInTimeZone(
            +flight.departure.scheduled,
            tz,
            "d MMM yyyy",
          )}
        />
        <IconDataCard
          icon={timer}
          label="Duration"
          value={minutesToHMFormat(+flight.totalDuration)}
        />
        <IconDataCard icon={gate} label="Gate" value={flight.departure.gate} />
        <IconDataCard
          icon={airplaneIcon}
          label="Terminal"
          value={flight.departure.terminal}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Passenger Information</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookingData.passengers.map((p) => {
            const seat = bookingData.seats.find(
              (s) => s.reservation.for === p._id,
            );
            return (
              <div
                key={p._id}
                className="rounded border bg-white p-4 shadow-sm"
              >
                <p className="font-medium">
                  {p.firstName} {p.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Seat: {seat?.seatNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ticket ID: {p._id}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-wrap justify-start gap-4">
        {bookingData.bookingStatus === "confirmed" && (
          <Button className="text-wrap">Download Ticket</Button>
        )}
        {canCancel && <Button variant="destructive">Cancel Flight</Button>}
        {canRefund && (
          <Button variant="outline" className="border-green-500 text-green-700">
            Request Refund
          </Button>
        )}
      </section>
    </main>
  );
}

function InfoCard({ title, value, status = false }) {
  const statusStyles = {
    confirmed: "bg-green-100 border-green-500 text-green-700",
    pending: "bg-yellow-100 border-yellow-500 text-yellow-700",
    canceled: "bg-red-100 border-red-500 text-red-700",
  };
  return (
    <div
      className={cn(
        `rounded border bg-white p-4`,
        status && statusStyles[value],
      )}
    >
      <p className="text-xs uppercase text-muted-foreground">{title}</p>
      <p className={`mt-1 text-sm font-medium`}>{value}</p>
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

function FlightTimeDetails({ label, time, airport, tz }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">
        {formatInTimeZone(+time, tz, "HH:mm")}
      </p>
      <p className="text-sm">{formatInTimeZone(+time, tz, "d MMM yyyy")}</p>
      <p className="text-xs text-muted-foreground">
        {airport.name} ({airport.iataCode})
      </p>
    </div>
  );
}

export async function generateMetadata({ params }) {
  return {
    title: `Booking #${params.bookingRef} - Flight Details`,
    description: `Detailed information for flight booking ID ${params.bookingRef}.`,
  };
}
