import { signOut } from "../auth";
export default async function signOutAction(prevState, formData) {
  try {
    await signOut();
    return { success: true, message: "User signed out successfully" };
  } catch (error) {
    throw error;
  }
}
