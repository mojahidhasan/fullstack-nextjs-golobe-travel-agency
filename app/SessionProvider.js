"use client";

import { SessionProvider as S } from "next-auth/react";

export default function SessionProvider({ children }) {
  return <S>{children}</S>;
}
