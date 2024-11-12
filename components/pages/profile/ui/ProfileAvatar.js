import { UploadProfilePicture } from "@/components/pages/profile/ui/UploadProfilePicture";
import Image from "next/image";
export function ProfileAvatar({ avatar }) {
  return (
    <>
      <div className="relative inline-block rounded-full border-4 border-tertiary">
        <Image
          className={
            "h-[160px] bg-background w-[160px] rounded-full object-cover object-center"
          }
          src={avatar}
          alt="avatar"
          width={160}
          height={160}
        />
        <UploadProfilePicture />
      </div>
    </>
  );
}
