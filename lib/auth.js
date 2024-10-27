import NextAuth from "next-auth";
import MongoDBAdapter from "./db/MongoDBAdapter";
import authConfig from "../auth.config";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { createDB } from "./db/createOperationDB";
import { getAccount, getUserByEmail } from "./db/getOperationDB";
import { deleteSession } from "./db/deleteOperationDB";

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

        const session = await createDB("Session", {
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
      return session;
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
    async encode(string) {
      return string.token?.sessionId ?? encode(string);
    },
  },
  events: {
    async signOut({ session }) {
      await deleteSession(session.sessionToken);
    },
  },
});
async function signUp(data) {
  const userObj = {
    email: data.email,
    name: data.firstname + " " + data.lastname,
    image: data.image,
  };
  const userDetailsObj = {
    firstname: data.firstname,
    lastname: data.lastname,
    email: [{ email: data.email, emailVerified: null, primary: true }],
    coverImage: data.coverImage,
    phone: data?.phone ? { number: data.phone, verified: false } : null,
    searchHistory: [],
    likes: { flights: [], hotels: [] },
    userId: undefined,
  };
  const accountsObj = {
    password: data.password,
    providerAccountId: undefined,
    provider: "credentials",
    type: "credentials",
    userId: undefined,
  };

  try {
    const { _id: userId } = await createDB("User", userObj);

    userDetailsObj.userId = userId;
    accountsObj.userId = userId;
    accountsObj.providerAccountId = userId.toString();

    const { _id: userDetailsId } = await createDB("UserDetail", userDetailsObj);
    const { _id: accountId } = await createDB("Account", accountsObj);

    return { userId, accountId, userDetailsId };
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
      const user = await getUserByEmail(credentials.email);
      if (!user) {
        return null;
      }
      const providerAccountId = user.id;
      const { password } = await getAccount(providerAccountId, "credentials");
      const isValid = bcrypt.compareSync(credentials.password, password);

      if (isValid) {
        return user;
      }
      return null;
    },
  };
}

export { handlers, auth, signIn, signOut, signUp, getSession, isLoggedIn };
