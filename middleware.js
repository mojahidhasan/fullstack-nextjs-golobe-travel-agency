import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);
  return response;
});
