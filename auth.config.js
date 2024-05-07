import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-pathname", request.nextUrl.pathname);

      const response = NextResponse.next({
        headers: requestHeaders,
      });

      switch (request.nextUrl.pathname) {
        case "/login":
          if (isLoggedIn) {
            return NextResponse.redirect(request.nextUrl.origin);
          }
          return response;
        case "/dashboard":
        case "/profile":
          if (isLoggedIn) {
            return NextResponse.next();
          }
          return false;
        default:
          return response;
      }
    },
  },
  providers: [], // Add providers with an empty array for now
};
