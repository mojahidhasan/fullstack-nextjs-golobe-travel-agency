import { ProfileImages } from "@/components/pages/profile/ProfileImages";
import { ProfileData } from "@/components/pages/profile/ProfileData";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import routes from "@/data/routes.json";
import { getUserDetails } from "@/lib/services/user";
export default async function ProfilePage({ searchParams }) {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  if (!isLoggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent(routes.profile.path),
    );
  }

  if (isLoggedIn) {
    const userDetails = await getUserDetails(session?.user?.id);

    return (
      <main className={"mx-auto mb-[90px] w-[95%] sm:w-[90%]"}>
        <ProfileImages
          avatar={userDetails.profileImage}
          cover={userDetails.coverImage}
          name={userDetails.firstName + " " + userDetails.lastName}
          email={userDetails.email}
        />
        <ProfileData
          tab={searchParams?.tab}
          userDetails={{
            ...userDetails,
            dateOfBirth: userDetails.dateOfBirth
              ? format(userDetails.dateOfBirth, "dd MMM yyyy")
              : null,
          }}
        />
      </main>
    );
  }
}
