import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import routes from "@/data/routes.json";
export default async function PagesLayout({ children }) {
  const session = await auth();
  const currentPathname = headers().get("x-pathname");

  const notAllowedPaths = [
    routes.login.path,
    routes.signup.path,
    routes["forgot-password"].path,
    routes["verify-password-reset-code"].path,
    routes["set-new-password"].path,
  ];

  const isAllowed = !notAllowedPaths.some((path) =>
    path.startsWith(currentPathname)
  );
  return (
    <>
      {isAllowed && <Nav session={session} type="default" />}
      {children}
      {isAllowed && <Footer />}
    </>
  );
}
