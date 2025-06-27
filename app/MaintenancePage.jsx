"use client";

import { useEffect, useState } from "react";
import { Loader, MailIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MaintenancePage({ message, startsAt, endsAt }) {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (endsAt) {
      const endTime = new Date(endsAt);

      const updateCountdown = () => {
        const now = new Date();
        const diff = endTime - now;

        if (diff <= 0) {
          setCountdown("Maintenance is ending soon.");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const h = hours < 1 ? "" : hours + "h";
        const m = minutes < 1 ? "" : minutes + "m";
        const s = seconds < 1 ? "" : seconds + "s";

        setCountdown(`${h} ${m} ${s}`);
      };
      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [endsAt]);

  return (
    <main className="mx-auto flex min-h-screen w-[95%] items-center justify-center sm:w-[90%]">
      <div className="my-[40px] flex min-h-[80%] grow items-center justify-center rounded-[20px] bg-primary/30 px-4 py-12 text-primary-foreground">
        <div className="relative w-full max-w-lg rounded-2xl border border-primary/20 bg-primary p-8 text-center shadow-xl backdrop-blur-md">
          {/* Logo / Branding */}

          <div className="absolute left-1/2 top-[-30px] flex h-[60px] w-[60px] -translate-x-1/2 items-center justify-center rounded-full bg-white">
            <svg
              width="233"
              height="212"
              viewBox="0 0 233 212"
              fill="#8DD3BB"
              xmlns="http://www.w3.org/2000/svg"
              className="h-[40px] w-[40px] transition-all hover:fill-[#112211]"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M183.982 67.9131C171.965 42.8421 146.914 25.564 113.497 25.564C65.7719 25.564 36.0049 60.8039 36.0049 103.655C36.0049 131.013 47.7309 155.071 68.7047 169.016C69.8998 168.122 70.6196 167.541 70.6196 167.541C81.0811 160.715 91.2866 153.53 101.219 146C82.5071 140.494 73.0579 122.589 73.0579 103.655C73.0579 81.1732 87.0612 59.2871 113.768 59.2871C137.286 59.2871 152.674 78.7831 154.329 99.8755C164.638 89.644 174.531 78.9821 183.982 67.9131ZM110.011 181.675C139.605 160.698 166.969 136.736 191.654 110.186C188.828 150.276 159.935 181.747 113.795 181.747C112.52 181.747 111.259 181.723 110.011 181.675Z"
              />
              <path d="M214.201 4.57168C176.335 -9.35095 149.114 20.6071 149.114 20.6071L174.927 35.6132C184.596 30.0604 188.903 35.4507 190.013 38.4031C190.799 40.4888 189.743 42.7641 188.903 44.0101L182.619 51.9466C148.708 92.8477 108.838 128.386 64.3364 157.423C64.3364 157.423 50.902 168.257 43.7514 168.42C37.7384 168.555 35.0569 163.49 40.1219 156.231L27.6626 128.115C27.6626 128.115 -4.75883 149.351 1.52501 186.676C4.1794 202.441 18.9952 213.655 34.7319 210.811C42.7763 209.375 52.7167 205.448 64.8781 197.403L87.2508 182.776C131.752 153.685 171.649 118.038 205.533 77.0831L213.226 67.7924C224.818 54.6011 230.019 43.7393 231.779 35.1527C234.488 22.0156 226.714 9.17644 214.201 4.57168Z" />
            </svg>
          </div>

          <div className="mb-4 mt-8 flex flex-col items-center gap-2">
            <Loader className="animate-spin text-secondary" size={48} />
            <h1 className="text-4xl font-bold text-white">
              Scheduled Maintenance
            </h1>
          </div>

          <p className="mb-5 text-lg font-bold text-secondary">
            {message ||
              "We're performing essential updates to improve your experience. Please check back soon."}
          </p>

          <div className="mb-4 space-y-1 text-sm text-secondary">
            {countdown && (
              <>
                <p className="text-xl font-bold text-black">
                  Estimated maintenance ends in:
                </p>
                <p className="mx-auto w-fit rounded-md bg-white p-2 text-xl font-bold text-black">
                  {countdown}
                </p>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              asChild
              className="bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/support">
                <MailIcon className="mr-2 h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
