import { signOutAction } from "../actions";
import { getApiResponseWithToast } from "../helpers.client/apiResponse";

export async function handleLogout(
  e,
  onSuccess = () => {},
  onError = () => {},
) {
  const signOutPromise = signOutAction();
  await getApiResponseWithToast(signOutPromise, { onSuccess, onError });
}
