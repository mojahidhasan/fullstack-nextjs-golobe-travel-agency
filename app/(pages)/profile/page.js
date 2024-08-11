import { ProfilePic } from "@/components/pages/profile/ProfilePic";
import { ProfileData } from "@/components/pages/profile/ProfileData";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getUserDetailsByUserIdCatched,
  getUserByIdCatched,
} from "@/lib/db/catchedData/getCatchedOperationDB";

export default async function ProfilePage({ searchParams }) {
  const sessionUser = (await auth())?.user;
  const isloggedIn = !!sessionUser;
  if (!isloggedIn) {
    redirect("/login?callbackPath=" + encodeURIComponent("/profile"));
  }

  if (isloggedIn) {
    const userDetails = await getUserDetailsByUserIdCatched(sessionUser?.id);
    const user = await getUserByIdCatched(sessionUser?.id);

    return (
      <main className={"mx-auto mb-[90px] w-[95%] sm:w-[90%]"}>
        <ProfilePic
          avatar={user.image}
          cover={userDetails.coverImage}
          name={user.name}
          email={user.email}
        />
        <ProfileData tab={searchParams?.tab} userDetails={userDetails} />
      </main>
    );
  }
}
