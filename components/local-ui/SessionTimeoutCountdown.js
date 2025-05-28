"use client";
import { useEffect, useRef, useState } from "react";
import { cn, debounce } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import { jumpTo } from "./Jumper";
import Countdown from "./Countdown";
import { getCookiesAction, setCookiesAction } from "@/lib/actions";

export default function SessionTimeoutCountdown({
  redirectionLink = "/",
  className,
  jumpToId,
  ...props
}) {
  const pathname = usePathname();
  const interval = useRef(null);
  const [open, setOpen] = useState(false);
  const [timeoutAt, setTimeoutAt] = useState(0);

  useEffect(() => {
    (async () => {
      const timeout = await syncCookieAndLocalstorage();
      setTimeoutAt(+timeout);
      setIntervalForCheckingSessionTimeout(+timeout, () => {
        setOpen(true);
      });
    })();

    async function syncCookieAndLocalstorage() {
      let timeoutLocal = localStorage.getItem("sessionTimeoutAt") || 0;
      let timeoutCookie =
        (await getCookiesAction(["sessionTimeoutAt"]))[0]?.value || 0;
      const biggerValue = Math.max(+timeoutCookie, +timeoutLocal);
      if (timeoutLocal !== timeoutCookie) {
        localStorage.setItem("sessionTimeoutAt", biggerValue);
        const setSessionTimeoutCookie = setCookiesAction;
        setSessionTimeoutCookie([
          {
            name: "sessionTimeoutAt",
            value: biggerValue,
            expires: new Date(biggerValue),
          },
        ]);
      }
      return biggerValue;
    }
    function setIntervalForCheckingSessionTimeout(
      timeoutAt = 0,
      doWhatIfTimeout = () => {},
    ) {
      // clear interval before setting a new one if there is any
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
      interval.current = setInterval(() => {
        // check if session is expired
        if (+timeoutAt < Date.now()) {
          doWhatIfTimeout();
          clearInterval(interval.current);
          interval.current = null;
        }
      }, 1000);
    }

    function handleStorageChange(e) {
      const ev = e.type === "storage" ? e : e.detail;
      if (ev.key === "sessionTimeoutAt") {
        const newValue = parseInt(ev.newValue);
        setTimeoutAt(newValue);
        setOpen(false);
        syncCookieAndLocalstorage();
        setIntervalForCheckingSessionTimeout(newValue, () => setOpen(true));
      }
    }
    const debouncedHandle = debounce(handleStorageChange, 2000);
    window.addEventListener("storage", debouncedHandle);
    window.addEventListener("customStorage", debouncedHandle);

    return () => {
      window.removeEventListener("customStorage", debouncedHandle);
      window.removeEventListener("storage", debouncedHandle);
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);
  return (
    <>
      <Dialog open={open}>
        <DialogContent close={false}>
          <DialogHeader>
            <DialogTitle className={"text-center text-2xl"}>
              Session Timeout
            </DialogTitle>
            <DialogDescription className={"text-center font-semibold"}>
              Your session has timed out. Please Search again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {pathname.startsWith("/flights/search") ? (
              <DialogClose asChild>
                <Button
                  className="w-full"
                  onClick={() => {
                    jumpToId && jumpTo(jumpToId);
                    setOpen(false);
                  }}
                >
                  Search Again
                </Button>
              </DialogClose>
            ) : (
              <Button asChild>
                <Link className="w-full" href={redirectionLink}>
                  Search Again
                </Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div
        className={cn(
          "bg-red-500 p-3 text-center font-bold text-white",
          className,
        )}
        {...props}
      >
        <span>Session Timeout in: </span>
        <Countdown
          className={"inline"}
          currentTimeMs={Date.now()}
          timeoutAtMs={timeoutAt}
        />
      </div>
    </>
  );
}
