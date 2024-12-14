import NextAuth from "next-auth";
import MongoDBAdapter from "./db/MongoDBAdapter";
import authConfig from "../auth.config";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { createOneDoc } from "./db/createOperationDB";
import { getOneDoc } from "./db/getOperationDB";
import { deleteOneDoc } from "./db/deleteOperationDB";
import mongoose from "mongoose";

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
  },
  adapter: MongoDBAdapter,
  providers: [
    FacebookProvider,
    GoogleProvider,
    AppleProvider,
    CredentialProvider(credentialProviderConfig()),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        const expires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
        const sessionToken = randomUUID();
        const session = await createOneDoc("Session", {
          sessionToken,
          userId: new mongoose.Types.ObjectId(user._id),
          expires,
        });

        token.sessionId = session.sessionToken;
        return token;
      }
    },

    async session({ session, user }) {
      session.user = { id: user.id, email: user.email };
      return session;
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    async encode(string) {
      // eslint-disable-next-line no-undef
      return string.token?.sessionId ?? encode(string);
    },
  },
  events: {
    async signOut({ session }) {
      await deleteOneDoc("Session", { sessionToken: session.sessionToken });
    },
  },
});
async function signUp(data) {
  const userObj = {
    _id: new mongoose.Types.ObjectId(),
    email: data.email,
    emailVerifiedAt: null,
    emails: [{ email: data.email, emailVerifiedAt: null, primary: true }],
    firstname: data.firstname,
    lastname: data.lastname,
    profileImage: data.profileImage,
    coverImage: data.coverImage,
    phone: data?.phone ?? null,
  };

  const accountsObj = {
    password: data.password,
    providerAccountId: userObj._id.toString(),
    provider: "credentials",
    type: "credentials",
    userId: userObj._id,
  };

  try {
    const { _id: userId } = await createOneDoc("User", userObj);
    const { _id: accountId } = await createOneDoc("Account", accountsObj);

    return { userId, accountId };
  } catch (error) {
    throw error;
  }
}

async function getSession() {
  try {
    return auth();
  } catch (error) {
    throw error;
  }
}

async function isLoggedIn() {
  try {
    return !!(await auth())?.user;
  } catch (error) {
    throw error;
  }
}

function credentialProviderConfig() {
  return {
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const userDetails = await getOneDoc(
        "User",
        { email: credentials.email.trim() },
        ["userDetails"],
        false
      );
      if (!userDetails || !Object.keys(userDetails).length) {
        return null;
      }

      const userId = userDetails._id;
      const { password } = await getOneDoc(
        "Account",
        {
          userId,
          provider: "credentials",
        },
        ["userAccount"],
        false
      );
      const isValid = bcrypt.compareSync(credentials.password, password);
      if (isValid) {
        return userDetails;
      }
      return null;
    },
  };
}

export { handlers, auth, signIn, signOut, signUp, getSession, isLoggedIn };
