import Link from "next/link";
import { Button } from "@/components/ui/button";
import routes from "@/data/routes.json";
export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 text-3xl font-black sm:text-5xl">
      <span className={"px-6 text-center leading-normal"}>
        {" "}
        Flight not found
      </span>
      <Button
        asChild
        variant={"outline"}
        className={"hover:bg-primary hover:text-white max-sm:h-[40px]"}
      >
        <Link className={"max-sm:text-xs"} href={routes.flights.path}>
          {routes.flights.title}
        </Link>
      </Button>
    </div>
  );
}
