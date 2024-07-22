import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "@/app/StoreProvider";
import { Notification } from "@/app/_notification";
import mongoose from "mongoose";

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
  openGraph: {
    title: "Golob Travel Agency",
    description:
      "Golob Travel Agency is a travel agency that provides top-notch travel services.",
    url: "https://golob-travel-agency.vercel.app",
    siteName: "Golob Travel Agency",
    images: [
      {
        url: "https://golob-travel-agency.vercel.app/opengraph-image.jpg", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URL);
    } catch (e) {
      console.log(e.message);
    }
  }
  return (
    <html lang="en" className={`${tradegothic.variable} ${monse.variable}`}>
      <body className={monse.className}>
        <StoreProvider>
          <div className="max-w-[1440px] mx-auto">
            <Notification />
            {children}
          </div>
        </StoreProvider>
        <NextTopLoader showSpinner={false} color="hsl(159, 44%, 69%)" />
        <Toaster className="bg-secondary" />
      </body>
    </html>
  );
}
