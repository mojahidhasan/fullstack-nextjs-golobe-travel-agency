"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import LogoutBtn from "@/components/LogoutBtn";

import { LogIn } from "lucide-react";
import love from "@/public/icons/love.svg";
import plane from "@/public/icons/airplane-filled.svg";
import hotel from "@/public/icons/building.svg";
import support from "@/public/icons/support.svg";
import logout from "@/public/icons/logout.svg";

import { useState } from "react";
import { usePathname } from "next/navigation";

import routes from "@/data/routes.json";
export function SideBar({ isLoggedIn, sideBarLinksUser }) {
  const pathname = encodeURIComponent(usePathname());
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(!sheetOpen)}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Sidebar Toggle"
          className="h-auto p-2 hover:bg-transparent"
        >
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
      </SheetTrigger>
      <SheetContent>
        <ul className="mt-2 grid gap-2 py-2 font-semibold">
          <li>
            <SheetClose asChild>
              <Button className={"h-auto gap-2 p-0"} variant="link" asChild>
                <Link href={routes.flights.path}>
                  <Image src={plane} alt="plane_icon" width={20} />
                  <span>{routes.flights.title}</span>
                </Link>
              </Button>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Button className={"h-auto gap-2 p-0"} variant="link" asChild>
                <Link href={routes.hotels.path}>
                  <Image src={hotel} alt="hotel_icon" width={20} />
                  <span>{routes.hotels.title}</span>
                </Link>
              </Button>
            </SheetClose>
          </li>
          <Separator />
          {!isLoggedIn ? (
            <>
              <li>
                <SheetClose asChild>
                  <Button className={"h-auto gap-2 p-0"} variant="link" asChild>
                    <Link
                      href={`${routes.login.path}?callbackPath=${pathname}`}
                    >
                      <LogIn width={20} />
                      <span>{routes.login.title}</span>
                    </Link>
                  </Button>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Button className={"h-auto gap-2 p-0"} variant="link" asChild>
                    <Link href={routes.signup.path}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5"
                      >
                        <path
                          d="M10 19L15 14L10 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 14H3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 7.5H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17.5 4V11"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>

                      <span>{routes.signup.title}</span>
                    </Link>
                  </Button>
                </SheetClose>
              </li>
            </>
          ) : (
            <>
              <li>
                <SheetClose asChild>
                  <Button className={"h-auto gap-2 p-0"} variant="link" asChild>
                    <Link href={routes.favourites.path}>
                      <Image src={love} alt="heart_icon" width={20} />
                      <span>{routes.favourites.title}</span>
                    </Link>
                  </Button>
                </SheetClose>
              </li>
              <Separator />
              {sideBarLinksUser.map((option, index) => {
                return (
                  <li key={index}>
                    <SheetClose asChild>
                      <Button
                        className={"h-auto gap-2 p-0"}
                        variant="link"
                        asChild
                      >
                        <Link href={option.href}>
                          {option.icon}
                          <span>{option.title}</span>
                        </Link>
                      </Button>
                    </SheetClose>
                  </li>
                );
              })}
              <Separator />
              <li>
                <SheetClose asChild>
                  <Button className={"h-auto gap-2 p-0"} variant="link" asChild>
                    <Link href={routes.support.path}>
                      <Image
                        src={support}
                        alt={routes.support.title}
                        width={20}
                      />
                      <span>{routes.support.title}</span>
                    </Link>
                  </Button>
                </SheetClose>
              </li>
              <li>
                <LogoutBtn
                  type="button"
                  className={"h-auto gap-2 p-0"}
                  variant="link"
                  btnContent={
                    <>
                      <Image src={logout} alt="logout_icon" width={20} />
                      <span>Logout</span>
                    </>
                  }
                  onSuccess={() => setSheetOpen(false)}
                />
              </li>
            </>
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
