import { signOut } from "../auth";
import { anonymousUserSignUpAction } from "./signUpAction";
export default async function signOutAction(prevState, formData) {
  let signedOut = false;
  try {
    await signOut({ redirect: false });
    signedOut = true;
    return { success: true, message: "User signed out successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  } finally {
    if (signedOut) {
      await anonymousUserSignUpAction();
    }
  }
}
