import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import { WebVitals } from "@/components/web-vitals";
import { StoreProvider } from "./StoreProvider";

import db from "@/lib/db";

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

await db.connect();

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en" className={`${tradegothic.variable} ${monse.variable}`}>
        <body className={monse.className}>
          <div className="max-w-[1440px] mx-auto">
            {/* <WebVitals /> */}
            {children}
          </div>
          <Toaster className="bg-secondary" />
        </body>
      </html>
    </StoreProvider>
  );
}
