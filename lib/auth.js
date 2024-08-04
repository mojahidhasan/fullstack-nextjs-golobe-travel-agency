import NextAuth from "next-auth";
import MongoDBAdapter from "./db/MongoDBAdapter";
import authConfig from "@/auth.config";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import {
  createAccount,
  createSession,
  createUser,
  createUserDetails,
} from "./db/createOperationDB";
import { getAccount, getUserByEmail } from "./db/getOperationDB";
import { encode } from "punycode";

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
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        const expires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
        const sessionToken = randomUUID();

        const session = await createSession({
          sessionToken,
          userId: user.id,
          expires,
        });
        token.sessionId = session.sessionToken;
        return token;
      }
    },

    async session({ session, user }) {
      session.user = { id: user.id, email: user.email };
      console.log(session);
      return session;
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    async encode(string) {
      return string.token?.sessionId ?? encode(string);
    },
  },
});
async function signUp(data) {
  const userObj = {
    email: data.email,
    name: data.firstname + " " + data.lastname,
    image: data.image,
    emailVerified: null,
  };
  const userDetailsObj = {
    firstname: data.firstname,
    lastname: data.lastname,
    email: [{ email: data.email, emailVerified: null, primary: true }],
    coverImage: data.coverImage,
    phone: data?.phone ? { number: data.phone, verified: false } : null,
    address: null,
    dateOfBirth: null,
    searchHistory: [],
    likes: { flights: [], hotels: [] },
    userId: null,
  };
  const accountsObj = {
    password: data.password,
    providerAccountId: null,
    provider: "credentials",
    type: "credentials",
    userId: null,
  };

  try {
    const userId = await createUser(userObj);

    userDetailsObj.userId = userId;
    accountsObj.userId = userId;
    accountsObj.providerAccountId = userId.toString();

    await createUserDetails(userDetailsObj);
    await createAccount(accountsObj);
  } catch (error) {
    throw error;
  }
}

function credentialConfig() {
  return {
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const user = await getUserByEmail(credentials.email);
      if (!user) {
        return null;
      }
      const providerAccountId = BigInt("0x" + user.id).toString();
      const { password } = await getAccount(providerAccountId, "golob");
      const isValid = bcrypt.compareSync(credentials.password, password);

      if (isValid) {
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
