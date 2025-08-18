import { Card, CardContent } from "@/components/ui/card";
import {
  Plane,
  Building2,
  Clock,
  Search,
  Building,
  Users,
  Type,
  ChevronsLeft,
} from "lucide-react";
import Link from "next/link";
import ShowTimeInClientSide from "./helpers/ShowTimeInClientSide";
import NoSSR from "./helpers/NoSSR";
import { Skeleton } from "./ui/skeleton";

/**
 * Renders a card component for displaying a recent search history.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.search - The search object containing details of the recent search.
 * @param {string} props.search.type - The type of search (flight or hotel).
 * @param {string} props.search.searchState - The unique identifier for the search.
 * @param {string} props.search.details - The details of the search (e.g., destination, travel dates).
 * @param {string} props.search.searchedAt - The date and time when the search was performed.
 *
 * flight specific
 * @param {string} [props.search.class] - The class of travel for flights (e.g., economy, business).
 * @param {string} [props.search.passengers] - The number of passengers for flights.
 * @param {string} [props.search.tripType] - The type of trip (one_way, round_trip).
 * @param {string} [props.search.departureDate] - The departure date for flights.
 * @param {string} [props.search.returnDate] - The return date for flights, if applicable.
 *
 * hotel specific
 * @param {string} [props.search.rooms] - The number of rooms for hotels.
 * @param {string} [props.search.guests] - The number of guests for hotels.
 * @param {string} [props.search.checkInDate] - The check-in date for hotels.
 * @param {string} [props.search.checkOutDate] - The check-out date for hotels.
 *
 * @return {JSX.Element} The SearchHistoryCard component.
 */

export default function SearchHistoryCard({ search }) {
  const searchParams = new URLSearchParams(search.searchState);
  let href = "/";
  if (search.type === "flight") {
    href += "flights";
  } else {
    href += "hotels";
  }
  href += `/search/${encodeURIComponent(searchParams.toString())}`;

  return (
    <Card className="w-full max-w-md rounded-2xl border-primary shadow-md transition-shadow hover:shadow-xl">
      <CardContent className="flex items-center gap-2 p-3">
        {/* Icon Section */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
          {search.type === "flight" ? (
            <Plane className="h-5 w-5 text-primary" />
          ) : (
            <Building2 className="h-5 w-5 text-primary" />
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-1 grow flex-col">
          <p className="text-base font-semibold leading-snug text-foreground">
            {search.details}
          </p>

          {/* Hotel Dates */}
          {search.type === "hotel" && (
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Building className="mr-1 h-3 w-3" />
                Rooms:&nbsp;
                {search.rooms}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                Guests:&nbsp;
                {search.guests}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Check-in:&nbsp;
                <NoSSR fallback={<Skeleton className="h-3 w-[100px]" />}>
                  <ShowTimeInClientSide
                    date={search.checkInDate}
                    formatStr="MMM d, yyyy "
                  />
                </NoSSR>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Check-out:&nbsp;
                <NoSSR fallback={<Skeleton className="h-3 w-[100px]" />}>
                  <ShowTimeInClientSide
                    date={search.checkOutDate}
                    formatStr="MMM d, yyyy "
                  />
                </NoSSR>
              </div>
            </div>
          )}

          {/* Flight Dates */}
          {search.type === "flight" && (
            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Type className="mr-1 h-3 w-3" />
                Trip Type:&nbsp;{search.tripType}
              </div>
              <div className="flex items-center">
                <ChevronsLeft className="mr-1 h-3 w-3 rotate-90" />
                Class:&nbsp;{search.class}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                Passengers:&nbsp;{search.passengers}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Departure:&nbsp;{search.departureDate}
              </div>
              {search.returnDate && (
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  Return:&nbsp;{search.returnDate}
                </div>
              )}
            </div>
          )}

          {/* Search Date */}
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Searched on:&nbsp;
            <NoSSR fallback={<Skeleton className="h-3 w-[100px]" />}>
              <ShowTimeInClientSide
                date={search.searchedAt}
                formatStr="MMM d, yyyy h:mm a"
              />
            </NoSSR>
          </div>
        </div>

        {/* Action Section */}
        <Link
          title="Search Again"
          href={href}
          className="rounded-full border-2 p-2 transition-all hover:border-primary hover:bg-primary/10"
        >
          <Search className="h-6 w-6 text-primary-foreground" />
        </Link>
      </CardContent>
    </Card>
  );
}
