import { ProfilePic } from "@/components/pages/profile/ProfilePic";
import { ProfileData } from "@/components/pages/profile/ProfileData";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserData } from "@/lib/data";

export default async function ProfilePage() {
  const user = (await auth())?.user;
  const isloggedIn = !!user;
  if (!isloggedIn) {
    redirect("/login?callbackPath=" + encodeURIComponent("/profile"));
  }

  if (isloggedIn) {
    const profileInfo = (await getUserData(user?.email)).profileInfo;
    return (
      <main className={"mx-auto mb-[90px] w-[90%]"}>
        <ProfilePic
          avatar={profileInfo.images.avatar}
          cover={profileInfo.images.cover}
          name={profileInfo.firstname + " " + profileInfo.lastname}
          email={profileInfo.email[0].username}
        />
        <ProfileData data={profileInfo} />
      </main>
    );
  }
}
