import "server-only";
import { unstable_cache } from "next/cache";
import db from "./db";

export const getUserData = unstable_cache(
  async (username) => {
    return getUser(username);
  },
  "getUserData",
  {
    revalidate: 1,
  }
);

async function getUser(username) {
  try {
    await db.connect();
    const user = await db.findUserDetails(username);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function getAvatar(url) {
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.img;
    })
    .catch((error) => {
      console.log(error);
    });
}
