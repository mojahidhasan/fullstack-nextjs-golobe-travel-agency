import { cookies } from "next/headers";

export default async function deleteCookies(cookiesArr) {
  for (const cookie of cookiesArr) {
    cookies().delete(cookie);
  }
}
