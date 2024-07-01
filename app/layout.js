import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "./StoreProvider";
import { Notification } from "./_notification";
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
  opengraph: {
    title: "Golob Travel Agency",
    description:
      "Golob Travel Agency is a travel agency that provides top-notch travel services.",
    images: ["https://unsplash.com/photos/Vv3iG9XBNx8"],
  },
};

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URL);
}

export default function RootLayout({ children }) {
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
