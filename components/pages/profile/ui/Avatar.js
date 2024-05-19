import { Button } from "@/components/ui/button";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as RadixAvatar,
} from "@/components/ui/avatar";
import Image from "next/image";

import pen from "@/public/icons/pen.svg";

export async function Avatar({ avatar }) {
  const getAvt = await fetch(avatar);
  const avt = (await getAvt.json()).img;
  return (
    <>
      <RadixAvatar className="h-[160px] bg-slate-500 w-[160px] rounded-full object-cover object-center">
        <AvatarImage src={avt} alt="profilePic" />
        <AvatarFallback></AvatarFallback>
      </RadixAvatar>
      <Button
        className={
          "absolute bottom-0 right-0 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-tertiary p-0"
        }
        variant={"icon"}
      >
        <Image
          className="h-auto w-auto"
          width={44}
          height={44}
          src={pen}
          alt=""
        />
      </Button>
    </>
  );
}
