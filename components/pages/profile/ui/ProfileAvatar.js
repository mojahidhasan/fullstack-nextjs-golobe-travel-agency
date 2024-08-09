"use client";

import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";

import { UploadProfilePicture } from "@/components/pages/profile/ui/UploadProfilePicture";

import { useState, useEffect } from "react";

export function ProfileAvatar({ avatar }) {
  return (
    <>
      <div className="relative inline-block rounded-full border-4 border-tertiary">
        <Avatar className="h-[160px] bg-background w-[160px] rounded-full object-cover object-center">
          <AvatarImage src={avatar} alt="profilePic" />
          <AvatarFallback>Loading...</AvatarFallback>
        </Avatar>
        <UploadProfilePicture />
      </div>
    </>
  );
}
