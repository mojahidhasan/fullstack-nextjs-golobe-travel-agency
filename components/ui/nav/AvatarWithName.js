import { ChevronRight } from "lucide-react";
import user from "@/public/icons/user.svg";
import card from "@/public/icons/card.svg";
import settings from "@/public/icons/settings.svg";
import support from "@/public/icons/support.svg";
import logout from "@/public/icons/logout.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { signOut } from "@/lib/actions";
export function AvatarWithName({
  onlineStatus = "Online",
  profilePic = "",
  profileName = "John Doe",
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:ring-offset-[none]">
        <Button variant="link" className={"gap-2 text-inherit"}>
          <Image
            src={"https://source.unsplash.com/45x45"}
            alt="profile_pic"
            height={45}
            width={45}
            className="rounded-full"
          />
          <span>John D.</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={20}
        align="end"
        className="font-medium p-4 w-[300px]"
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Image
              src={"https://source.unsplash.com/45x45"}
              alt="profile_pic"
              height={50}
              width={50}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{profileName}</p>
              <p className="text-sm opacity-75">{onlineStatus}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-4" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="justify-between cursor-pointer">
            <Link href="/profile">
              <div className="flex items-center gap-2">
                <Image src={user} alt="user_icon" height={18} width={18} />
                <span>My Account</span>
              </div>
              <ChevronRight height={16} width={16} />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="justify-between cursor-pointer">
            <Link href="/coming-soon">
              <div className="flex items-center gap-2">
                <Image src={card} alt="card_icon" height={18} width={18} />
                <span>Payments</span>
              </div>
              <ChevronRight height={16} width={16} />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="justify-between cursor-pointer">
            <Link href="/coming-soon">
              <div className="flex items-center gap-2">
                <Image
                  src={settings}
                  alt="settings_icon"
                  height={18}
                  width={18}
                />
                <span>Settings</span>
              </div>
              <ChevronRight height={16} width={16} />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-4" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="justify-between cursor-pointer">
            <Link href="/coming-soon">
              <div className="flex items-center gap-2">
                <Image
                  src={support}
                  alt="support_icon"
                  height={18}
                  width={18}
                />
                <span>Support</span>
              </div>
              <ChevronRight height={16} width={16} />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <form action={signOut}>
              <Button
                variant="Ghost"
                className={
                  "gap-2 justify-start p-0 w-full h-auto text-inherit font-medium"
                }
                type={"submit"}
              >
                <Image src={logout} alt="logout_icon" height={18} width={18} />
                <span>Logout</span>
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
