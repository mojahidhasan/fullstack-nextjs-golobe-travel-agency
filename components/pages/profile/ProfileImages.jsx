import { UploadCoverPhoto } from "@/components/pages/profile/ui/UploadCoverPhoto";
import { ProfileAvatar } from "@/components/pages/profile/ui/ProfileAvatar";
import Image from "next/image";

export function ProfileImages({ avatar, cover, name, email }) {
  return (
    <div className="relative mt-[40px]">
      <div className="relative">
        <Image
          width={ 1440 }
          height={ 350 }
          src={ cover }
          alt="defaultCoverPhoto"
          className="h-[350px] w-full rounded-md sm:rounded-[12px] object-cover object-center"
        />
        <div className="absolute z-50 bottom-[24px] right-[24px]">
          <UploadCoverPhoto />
        </div>
      </div>
      <div className="relative gap-3 -top-[80px] flex w-full xsm:text-center px-5 flex-col items-start xsm:items-center">
        <ProfileAvatar avatar={ avatar } />
        <div>
          <h2 className="text-[1.5rem] font-semibold">{ name }</h2>
          <p className="opacity-75">{ email }</p>
        </div>
      </div>
    </div>
  );
}
