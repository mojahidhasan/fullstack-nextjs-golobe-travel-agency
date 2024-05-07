import { Button } from "@/components/ui/button";
import Image from "next/image";

import pen from "@/public/icons/pen.svg";

export function Avatar({ avatar }) {
  return (
    <>
      <Image
        width={160}
        height={160}
        src={avatar || "https://source.unsplash.com/0YHIlxeCuhg"}
        alt="defaultProfilePhoto"
        className="h-[160px] w-[160px] rounded-full object-cover object-center"
      />
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
