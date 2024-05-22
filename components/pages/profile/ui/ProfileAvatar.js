"use client";

import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

import { UploadProfilePicture } from "./UploadProfilePicture";

import { useState, useEffect } from "react";

import { validateURL } from "@/lib/utils";

export function ProfileAvatar({ avatar }) {
  const [avt, setAvt] = useState(null);

  useEffect(() => {
    (async function () {
      if (!validateURL(avatar)) {
        setAvt(avatar);
        return;
      }
      if (validateURL(avatar)) {
        const getAvt = await fetch(avatar, {
          next: {
            tags: ["avatar"],
            revalidate: 3600,
          },
        });
        const avt = (await getAvt.json()).img;
        setAvt(avt);
        return;
      }
    })();
  }, [avatar]);
  return (
    <>
      <div className="relative inline-block rounded-full border-4 border-tertiary">
        <Avatar className="h-[160px] bg-background w-[160px] rounded-full object-cover object-center">
          <AvatarImage src={avt} alt="profilePic" />
          <AvatarFallback>Loading...</AvatarFallback>
        </Avatar>
        <UploadProfilePicture />
      </div>
    </>
  );
}
