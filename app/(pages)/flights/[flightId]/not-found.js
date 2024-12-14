import Link from "next/link";
import { Button } from "@/components/ui/button";
import routes from "@/data/routes.json";
export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 text-3xl sm:text-5xl font-black">
      <span className={"text-center px-6 leading-normal"}>
        The Flight you are looking for does not exist or got expired
      </span>
      <Button
        asChild
        variant={"outline"}
        className={"max-sm:h-[40px] hover:bg-primary hover:text-white"}
      >
        <Link className={"max-sm:text-xs"} href={routes.flights.path}>
          {routes.flights.title}
        </Link>
      </Button>
    </div>
  );
}
