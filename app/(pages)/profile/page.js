import { ProfileImages } from "@/components/pages/profile/ProfileImages";
import { ProfileData } from "@/components/pages/profile/ProfileData";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOneDoc } from "@/lib/db/getOperationDB";
export default async function ProfilePage({ searchParams }) {
  const sessionUser = (await auth())?.user;
  const isloggedIn = !!sessionUser;
  if (!isloggedIn) {
    redirect("/login?callbackPath=" + encodeURIComponent("/profile"));
  }

  if (isloggedIn) {
    const userDetails = await getOneDoc("User", { _id: sessionUser?.id }, [
      "userDetails",
    ]);

    return (
      <main className={"mx-auto mb-[90px] w-[95%] sm:w-[90%]"}>
        <ProfileImages
          avatar={userDetails.profileImage}
          cover={userDetails.coverImage}
          name={userDetails.firstname + " " + userDetails.lastname}
          email={userDetails.email}
        />
        <ProfileData tab={searchParams?.tab} userDetails={userDetails} />
      </main>
    );
  }
}
