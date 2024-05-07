import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function ProfileSettings({ isLoggedIn }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="p-2 hover:bg-transparent h-auto">
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className=""
          >
            <path
              d="M1.125 1.125H16.875M1.125 6H16.875M1.125 10.875H16.875"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeMiterlimit="1"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="">
          <li className="border-b-2">
            <Link href="/flights" className={"block"}>
              Find flights
            </Link>
          </li>
          <li className="border-b-2">
            <Link href="/hotels" className={"block"}>
              Find stays
            </Link>
          </li>
          {!isLoggedIn ? (
            <>
              <li className="rounded-8px border-b-2 bg-black p-4px text-center">
                <Link href="/login" className={"block text-white"}>
                  Login
                </Link>
              </li>
              <li className="rounded-8px border-b-2 bg-mint-green p-4px text-center">
                <Link
                  href="/signup"
                  className={cn(
                    "block bg-primary text-0.875rem font-semibold text-blackish-green"
                  )}
                >
                  Sign up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center justify-center rounded-8px border-b-2 bg-black p-4px text-center">
                <Button
                  className={cn(
                    "h-fit bg-transparent px-1px py-1px text-white"
                  )}
                  href="/favourites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 max-h-6 w-6 max-w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span>Favourites</span>
                </Button>
              </li>
              <li className="flex items-center justify-center rounded-8px border-b-2 p-4px text-center">
                <Button className={"gap-8px px-1px py-1px"}>
                  <Image
                    src={"https://source.unsplash.com/45x45"}
                    alt=""
                    height={45}
                    width={45}
                    className="rounded-full"
                  />
                  <span>John D.</span>
                </Button>
              </li>
            </>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
