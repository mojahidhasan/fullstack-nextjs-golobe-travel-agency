import { ProfilePic } from "@/components/pages/profile/ProfilePic";
import { ProfileData } from "@/components/pages/profile/ProfileData";

export default function ProfilePage() {
  const userData = {
    images: {
      avatar: "https://source.unsplash.com/0YHIlxeCuhg",
      cover: "https://source.unsplash.com/QWutu2BRpOs",
    },
  };

  return (
    <main className={"mx-auto mb-[90px] w-[90%]"}>
      <ProfilePic
        avatar={userData?.images.avatar ?? ""}
        cover={userData?.images.cover ?? ""}
      />
      <ProfileData data={userData} />
    </main>
  );
}
