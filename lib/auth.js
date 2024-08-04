import NextAuth from "next-auth";
import DB from "./db";
import MongoDBAdapter from "./db/MongoDBAdapter";
import authConfig from "@/auth.config";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { configureStore } from "@reduxjs/toolkit";
const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  cookies: {
    sessionToken: {
      name: "authjs.session_token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
      },
    },
  },
  session: {
    strategy: "database",
    jwt: false,
    maxAge: 60 * 60 * 24 * 30, //30 days
    updateAge: 60 * 60 * 24, // 1 day

    //session token format
    // [createdAt].[updateAge].[maxAge]
    generateSessionToken() {
      const createdAt = Date.now();
      const maxAge = createdAt + 60 * 60 * 24 * 30 * 1000;
      const updateAge = createdAt + 60 * 60 * 24 * 1000;

      return encodeSessionToken({ createdAt, updateAge, maxAge });
    },
  },
  adapter: MongoDBAdapter,
  providers: [
    FacebookProvider,
    GoogleProvider,
    AppleProvider,
    CredentialProvider(credentialConfig()),
  ],
  callbacks: {
    async authorized({ auth, request }) {
      console.log(auth, request);
    },
    async session({ session, user }) {
      session.user = { id: user.id, email: user.email };
      return session;
    },
  },
});
async function signUp(formData) {
  try {
    return await createUser(formData);
  } catch (error) {
    throw error;
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

function credentialConfig() {
  return {
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
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
  };
}

function encodeSessionToken({ createdAt, updateAge, maxAge }) {
  return Buffer.from(`${createdAt}.${updateAge}.${maxAge}`).toString("base64");
}
function decodeSessionToken(token) {
  const t = Buffer.from(token, "base64").toString("utf-8");
  const arr = t.split(".");
  const obj = {
    createdAt: parseInt(arr[0]),
    updateAge: parseInt(arr[1]),
    maxAge: parseInt(arr[2]),
  };
  return obj;
}

export {
  handlers,
  auth,
  signIn,
  signOut,
  signUp,
  encodeSessionToken,
  decodeSessionToken,
};
