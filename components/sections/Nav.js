import { ActiveNavLink } from "@/components/local-ui/nav/ActiveNavLink";
import { Logo } from "@/components/Logo";
import { AvatarWithName } from "@/components/local-ui/nav/AvatarWithName";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SideBar } from "@/components/local-ui/nav/SideBar";
import { cn } from "@/lib/utils";

import routes from "@/data/routes.json";

import user from "@/public/icons/user.svg";
import card from "@/public/icons/card.svg";
import settings from "@/public/icons/settings.svg";
import Image from "next/image";
import { BookCopyIcon } from "lucide-react";
import { getUserDetails } from "@/lib/services/user";

export async function Nav({ className, type = "default", session, ...props }) {
  const isLoggedIn = !!session?.user;
  let nameOfUser, avatar;
  if (isLoggedIn) {
    const userData = await getUserDetails(session?.user?.id);
    avatar = userData.profileImage;
    nameOfUser = userData.firstName + " " + userData.lastName;
  }
  const types = {
    home: {
      nav: "rounded-[24px] px-[32px] text-white backdrop-blur-[2px]",
      logoFill: "white", //valid color convention (hex, hsl, rgb, color name)
      btnFavorite: "text-inherit",
      btnSignup: "bg-white text-secondary hover:bg-white/90",
    },
    default: {
      nav: "relative bg-white text-secondary dark:bg-secondary",
      logoFill: "black", //valid color convention (hex, hsl, rgb, color name)
      btnFavorite: "text-inherit",
      btnSignup: "text-white bg-secondary hover:bg-secondary/90",
    },
  };

  const sideBarLinksUser = [
    {
      title: "Profile",
      href: "/user/profile",
      icon: <Image src={user} alt="user_icon" height={18} width={18} />,
    },
    {
      title: "My Bookings",
      href: "/user/my_bookings",
      icon: <BookCopyIcon height={18} width={18} />,
    },
    {
      title: "Payments",
      href: "/user/payments",
      icon: <Image src={card} alt="card_icon" height={18} width={18} />,
    },
    {
      title: "Settings",
      href: "/user/settings",
      icon: <Image src={settings} alt="settings_icon" height={18} width={18} />,
    },
  ];

  return (
    <nav
      className={cn(
        "flex h-[70px] w-full items-center justify-end px-[5%] shadow-lg lg:h-[90px] lg:justify-between",
        types[type].nav,
        className,
      )}
      {...props}
    >
      {/* menu */}
      <div className="lg:hidden">
        <SideBar isLoggedIn={isLoggedIn} sideBarLinksUser={sideBarLinksUser} />
        {/*small screen end*/}
      </div>
      {/* menu end*/}

      {/* big screen start */}
      <ActiveNavLink
        className={"hidden h-full lg:flex lg:items-center lg:gap-8"}
      />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Logo className={"h-[36px] w-fit"} otherFill={types[type].logoFill} />
      </div>

      {isLoggedIn === true ? (
        <div className="hidden lg:flex lg:items-center lg:gap-5">
          <Button
            className={cn("p-2 text-inherit", types[type].btnFavorite)}
            variant={"link"}
          >
            <Link href={routes.favourites.path} className="inline-flex gap-2">
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
              <span>{routes.favourites.title}</span>
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button asChild variant="link" className={"gap-2 text-inherit"}>
              <AvatarWithName
                sideBarLinksUser={sideBarLinksUser}
                profileName={nameOfUser}
                profilePic={avatar}
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex lg:items-center lg:gap-[32px]">
          <Button asChild variant="link" className={"text-inherit"}>
            <Link href={routes.login.path}>{routes.login.title}</Link>
          </Button>
          <Button
            className={cn(
              "bg-black text-white hover:bg-gray-900",
              types[type].btnSignup,
            )}
            asChild
          >
            <Link href={routes.signup.path}>{routes.signup.title}</Link>
          </Button>
        </div>
      )}

      {/* big screen end */}
    </nav>
  );
}
