import { auth } from "@/lib/auth";
import { permanentRedirect } from "next/navigation";
async function Profile() {
  const user = (await auth())?.user;
  if (user) {
    permanentRedirect("/profile/" + encodeURIComponent(user.email));
  } else {
    permanentRedirect("/login?callbackPath=" + encodeURIComponent("/profile"));
  }
}

export default Profile;
