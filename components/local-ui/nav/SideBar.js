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

import { useFormState } from "react-dom";
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
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { usePathname } from "next/navigation";

import routes from "@/data/routes.json";
export function SideBar({ isLoggedIn }) {
  const afterLoggedinOptions = [
    {
      title: routes.profile.title,
      icon: user,
      path: routes.profile.path,
    },
    {
      title: routes.payments.title,
      icon: card,
      path: routes.payments.path,
    },
    {
      title: routes.settings.title,
      icon: settings,
      path: routes.settings.path,
    },
    {
      separator: true,
    },
    {
      title: routes.support.title,
      icon: support,
      path: routes.support.path,
    },
  ];
  const pathname = encodeURIComponent(usePathname());
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useFormState(signOutAction, undefined);

  useEffect(() => {
    if (state?.success === true) {
      toast({
        title: "Logout Successful",
        description: state?.message,
        variant: "default",
      });
      setOpen(false);
    }

    if (state?.success === false) {
      toast({
        title: "Logout Failed",
        description: state?.message,
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Sheet open={open} onOpenChange={() => setOpen(!open)}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Sidebar Toggle"
          className="p-2 hover:bg-transparent h-auto"
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
        <ul className="grid mt-2 gap-2 py-2 font-semibold">
          <li>
            <SheetClose asChild>
              <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
                <Link href={routes.flights.path}>
                  <Image src={plane} alt="plane_icon" width={20} />
                  <span>{routes.flights.title}</span>
                </Link>
              </Button>
            </SheetClose>
          </li>
          <li>
            <SheetClose asChild>
              <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
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
                  <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
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
                  <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
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
                  <Button className={"p-0 h-auto gap-2"} variant="link" asChild>
                    <Link href={routes.favourites.path}>
                      <Image src={love} alt="heart_icon" width={20} />
                      <span>{routes.favourites.title}</span>
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
                        <Link href={option.path}>
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
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    toast({
                      title: "Logging out",
                      description: "Please wait...",
                      variant: "info",
                    });
                    dispatch();
                  }}
                >
                  <Button
                    type="submit"
                    className={"p-0 h-auto gap-2"}
                    variant="link"
                  >
                    <Image src={logout} alt="logout_icon" width={20} />
                    <span>Logout</span>
                  </Button>
                </form>
              </li>
            </>
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
