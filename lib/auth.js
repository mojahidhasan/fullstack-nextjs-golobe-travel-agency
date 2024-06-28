import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { z, ZodError } from "zod";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./db/clientPromise";

import DB from "./db";

import { PASSWORD_REGEX, PHONE_REGEX } from "./constants";

async function getUser(email) {
  try {
    await DB.connect();
    const user = await DB.findUserInfo(email);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

async function createUser(infoObj) {
  try {
    await DB.connect();
    const createUserDetails = await DB.createUserDetails(infoObj);
    const createUserInfo = await DB.createUserInfo(infoObj);

    return createUserInfo;
  } catch (error) {
    throw new Error("Failed to create user or this user already exists");
  }
}

const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      authorize: async function (credentials) {
        const user = await getUser(credentials.email);
        if (!user) {
          return null;
        }
        const valid = bcrypt.compareSync(credentials.password, user.password);
        if (valid) {
          return user;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});

async function signUp(formData) {
  try {
    return await createUser(formData);
  } catch (error) {
    throw error;
  }
}
export { handlers, auth, signIn, signOut, signUp };
