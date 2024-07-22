import "server-only";
import { SubscribeNewsletter } from "@/components/SubscribeNewsletter";
import { QuickLinks } from "@/components/QuickLinks";

import Link from "next/link";
export function Footer() {
  return (
    <footer className="relative pb-5">
      <SubscribeNewsletter />
      <QuickLinks />
      <div className="relative z-10 text-center font-medium">
        The UI design was taken from &nbsp;
        <Link
          className="inline text-white"
          href="https://www.figma.com/community/file/1182308758714734501/golobe-travel-agency-website"
          target="_blank"
          rel="noopener noreferrer"
        >
          Figma Community
        </Link>
      </div>
    </footer>
  );
}
