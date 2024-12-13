import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import routes from "@/data/routes.json";
export default async function PagesLayout({ children }) {
  const navNotAllowedPaths = [
    routes.login.path,
    routes.signup.path,
    routes["forgot-password"].path,
    routes["verify-password-reset-code"].path,
    routes["set-new-password"].path,
  ];

  const session = await auth();
  const currentPathname = headers().get("x-pathname");

  const isNavAllowed = !navNotAllowedPaths.some((path) =>
    path.startsWith(currentPathname)
  );

  return (
    <>
      {isNavAllowed && <Nav session={session} type="default" />}
      {children}
      {isNavAllowed && <Footer />}
    </>
  );
}
