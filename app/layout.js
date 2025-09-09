import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/app/StoreProvider";
import { SessionProvider } from "next-auth/react";
import mongoose from "mongoose";

import dynamic from "next/dynamic";

import openGraph from "./opengraph-image.jpg";
import MaintenancePage from "./MaintenancePage";
import { MaintenanceNotice } from "./MaintenanceNotice";
import SetNecessaryCookies from "./SetNecessaryCookies";
import { getOneDoc } from "@/lib/db/getOperationDB";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";

const monse = Montserrat({
  subsets: ["latin"],
  variable: "--font-monserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const tradegothic = localFont({
  src: "../public/fonts/gothic_extended.otf",
  variable: "--font-tradegothic",
  display: "swap",
});

export const metadata = {
  title: "Golob Travel Agency",
  description:
    "Golob Travel Agency is a travel agency that provides top-notch travel services.",
  keywords: [
    "travel",
    "agency",
    "golob",
    "travel agency",
    "golob travel agency",
    "nextjs",
    "react",
    "javascript",
    "tailwind css",
    "next auth",
    "mongodb",
    "node js",
    "redux",
    "web app",
  ],
  metadataBase: new URL("https://golob-travel-agency.vercel.app"),
  openGraph: {
    title: "Golob Travel Agency",
    description:
      "Golob Travel Agency is a travel agency that provides top-notch travel services (fake, personal project).",
    siteName: "Golob Travel Agency",
    images: [
      {
        url: openGraph.src,
        width: openGraph.width,
        height: openGraph.height,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    } catch (e) {
      console.log(e);
    }
  }

  const Notice = dynamic(
    () => import("@/app/_notice").then((mod) => mod.Notice),
    {
      ssr: false,
    },
  );

  const websiteConfig = await getOneDoc(
    "WebsiteConfig",
    {},
    ["websiteConfig"],
    60,
  );

  const maintenanceMode = websiteConfig?.maintenanceMode ?? { enabled: false };

  const alloweRoutesWhileMaintenance = maintenanceMode?.allowlistedRoutes ?? [];
  const currentPathname = headers().get("x-pathname");

  return (
    <html lang="en" className={`${tradegothic.variable} ${monse.variable}`}>
      <body className={monse.className}>
        {maintenanceMode.enabled === true &&
        !alloweRoutesWhileMaintenance.some(
          (path) =>
            path === currentPathname ||
            (path !== "/" && currentPathname.startsWith(path)),
        ) ? (
          <MaintenancePage
            message={maintenanceMode.message}
            startsAt={maintenanceMode.startsAt || 0}
            endsAt={maintenanceMode.endsAt || 0}
          />
        ) : (
          <StoreProvider>
            <SessionProvider>
              <div className="mx-auto max-w-[1440px]">
                <Notice />
                <MaintenanceNotice maintenanceMode={maintenanceMode} />
                {children}
              </div>
            </SessionProvider>
          </StoreProvider>
        )}
        <NextTopLoader showSpinner={false} color="hsl(159, 44%, 69%)" />
        <Toaster richColors closeButton expand position="top-right" />
        <SetNecessaryCookies />
        <Analytics />
      </body>
    </html>
  );
}
