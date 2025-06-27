import Link from "next/link";
import { Button } from "@/components/ui/button";
import routes from "@/data/routes.json";
import NotFound from "@/app/not-found";
export default function FlightNotFound() {
  return (
    <NotFound
      whatHappened="Flight Not Found"
      explanation={
        "Sorry, the flight you're looking for doesn't exist or has been moved. Let's take you back flight search."
      }
      navigateTo={{ path: routes.flights.path, title: routes.flights.title }}
    />
  );
}
