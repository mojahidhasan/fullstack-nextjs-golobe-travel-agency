import { UploadCoverPhoto } from "./ui/UploadCoverPhoto";
import { Avatar } from "./ui/Avatar";
import Image from "next/image";

export function ProfilePic({ avatar, cover, name, email }) {
  return (
    <div className="relative mt-[40px]">
      <div className="relative">
        <Image
          width={1440}
          height={350}
          src={cover}
          alt="defaultCoverPhoto"
          className="h-[350px] w-full rounded-[12px] object-cover object-center"
        />
        <div className="absolute z-50 bottom-[24px] right-[24px]">
          <UploadCoverPhoto />
        </div>
      </div>
      <div className="relative -top-[80px] flex w-full flex-col items-center">
        <div className="relative mb-[24px] inline-block rounded-full border-4 border-tertiary">
          <Avatar avatar={avatar} />
        </div>
        <div className="text-center">
          <h2 className="text-[1.5rem] font-semibold">{name}</h2>
          <p className="opacity-75">{email}</p>
        </div>
      </div>
    </div>
  );
}
