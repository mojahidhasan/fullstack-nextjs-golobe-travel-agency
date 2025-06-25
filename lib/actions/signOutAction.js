import { signOut } from "../auth";
export default async function signOutAction(prevState, formData) {
  try {
    await signOut({ redirect: false });
    return { success: true, message: "User signed out successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}
