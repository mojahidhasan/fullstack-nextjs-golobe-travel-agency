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

import { signOutAction } from "@/lib/actions";

import { LogIn } from "lucide-react";
import love from "@/public/icons/love.svg";
import plane from "@/public/icons/airplane-filled.svg";
import hotel from "@/public/icons/building.svg";
import user from "@/public/icons/user.svg";
import card from "@/public/icons/card.svg";
import settings from "@/public/icons/settings.svg";
import support from "@/public/icons/support.svg";
import logout from "@/public/icons/logout.svg";
export function SideBar({ isLoggedIn }) {
  const afterLoggedinOptions = [
    {
      title: "My account",
      icon: user,
      link: "/profile",
    },
    {
      title: "Payments",
      icon: card,
      link: "/profile?tab=payments",
    },
    {
      title: "Settings",
      icon: settings,
      link: "/profile?tab=settings",
    },
    {
      separator: true,
    },
    {
      title: "Support",
      icon: support,
      link: "/support",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
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
      </SheetTrigger>
      <SheetContent>
        <ul className="grid mt-2 gap-2 py-2 font-semibold">
          <li>
            <SheetClose asChild>
              <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
                <Link href="/flights">
                  <Image src={plane} alt="plane_icon" width={20} />
                  <span>Find Flights</span>
                </Link>
              </Button>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
                <Link href="/hotels">
                  <Image src={hotel} alt="hotel_icon" width={20} />
                  <span>Find Stays</span>
                </Link>
              </Button>
            </SheetClose>
          </li>
          <Separator />
          {!isLoggedIn ? (
            <>
              <li>
                <SheetClose asChild>
                  <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
                    <Link href="/login">
                      <LogIn width={20} />
                      <span>Login</span>
                    </Link>
                  </Button>
                </SheetClose>
              </li>
              <li>
                <SheetClose asChild>
                  <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
                    <Link href="/signup">
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

                      <span>Sign up</span>
                    </Link>
                  </Button>
                </SheetClose>
              </li>
            </>
          ) : (
            <>
              <li>
                <SheetClose asChild>
                  <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
                    <Link href="/favourites">
                      <Image src={love} alt="heart_icon" width={20} />
                      <span>Favourites</span>
                    </Link>
                  </Button>
                </SheetClose>
              </li>
              <Separator />
              {afterLoggedinOptions.map((option, index) => {
                if (option.separator) {
                  return <Separator key={index} />;
                }
                return (
                  <li key={index}>
                    <SheetClose asChild>
                      <Button
                        className={"p-0 h-auto gap-2"}
                        variant="link"
                        asChild
                      >
                        <Link href={option.link}>
                          <Image
                            src={option.icon}
                            alt={option.title}
                            width={20}
                          />
                          <span>{option.title}</span>
                        </Link>
                      </Button>
                    </SheetClose>
                  </li>
                );
              })}
              <li>
                <SheetClose asChild>
                  <form action={signOutAction}>
                    <Button className={"p-0 h-auto gap-2"} variant="link">
                      <Image src={logout} alt="logout_icon" width={20} />
                      <span>Logout</span>
                    </Button>
                  </form>
                </SheetClose>
              </li>
            </>
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
