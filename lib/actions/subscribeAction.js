import { Subscription } from "../db/models";
import { getUserByEmail } from "../db/getOperationDB";
import { createOneDoc } from "../db/createOperationDB";

export default async function subscribeAction(prevState, formData) {
  if (formData instanceof FormData === false)
    throw new Error("2nd argument have to be instance of FormData object");

  const email = formData.get("subscribe-email");
  if (email.trim() === "") return { success: false, error: "Provide Email" };

  const isAlreadySubscribed = await Subscription.exists({
    email,
  });

  if (isAlreadySubscribed) {
    return { success: false, error: "You already subscribed" };
  }

  const subcriptionData = {
    email,
    userId: null,
    emailVerified: null,
  };

  const hasUserAccount = await getUserByEmail(subcriptionData.email);
  if (hasUserAccount) {
    subcriptionData.userId = hasUserAccount.id;
    subcriptionData.emailVerified = hasUserAccount.emailVerified;
  }

  try {
    await createOneDoc("Subscription", subcriptionData);
    return { success: true, message: "Subscribed!! Thank you." };
  } catch (error) {
    return { success: false, error: error.message };
  }
}