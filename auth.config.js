import { NextResponse } from "next/server";
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isloggedIn = !!auth?.user;
      const isOnLoginPage = request.nextUrl.pathname === "/login";
      if (isloggedIn && isOnLoginPage) {
        //callbackPath will come from protected route when it is hit without login
        const callbackPath =
          request.nextUrl.searchParams.get("callbackPath") || "/";
        return NextResponse.redirect(
          new URL(decodeURIComponent(callbackPath), request.nextUrl.origin)
        );
      }
      return true;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.id;

      return session;
    },
  },
  providers: [],
};
