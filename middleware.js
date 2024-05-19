import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const auth = NextAuth(authConfig).auth;

export default auth((req) => {
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  console.log("middleware", req.nextUrl.pathname);
  return response;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
