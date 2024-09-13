"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/local-ui/input";

import { isEmailValid } from "@/lib/utils";

import { useState, useEffect } from "react";

import mailbox from "@/public/images/mailbox.svg";

export function SubscribeNewsletter() {
  const [subscribeNewsletterDom, setSubscribeNewsletterDom] = useState(null);
  const [height, setHeight] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [isValidE, setisValidE] = useState(true);

  useEffect(() => {
    const getId = document.getElementById("newsletter");
    setSubscribeNewsletterDom(getId);
    let h =
      subscribeNewsletterDom?.parentNode.clientHeight -
      subscribeNewsletterDom?.clientHeight / 2;

    function resize() {
      h =
        subscribeNewsletterDom?.parentNode.clientHeight -
        subscribeNewsletterDom?.clientHeight / 2;
      setHeight(isNaN(h) ? 500 : h);
    }

    setHeight(isNaN(h) ? 500 : h);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [subscribeNewsletterDom]);

  function handleChange(e) {
    const isValid = e.target.value !== "" ? isEmailValid(e.target.value) : null;

    setisValidE(isValid);
  }

  return (
    <>
      <section
        id="newsletter"
        className="relative z-10 mx-auto mb-[80px] flex h-[305px] w-[90%] items-end justify-between gap-[16px] rounded-[20px] bg-[#CDEAE1] px-[24px]"
      >
        <div className="self-center">
          <h2 className="mb-[10px] font-tradeGothic text-[1.5rem] font-bold leading-[3.375rem] text-secondary lg:text-[2.5rem] xl:text-[2.75rem]">
            Subscribe Newsletter
          </h2>
          <h3 className="mb-[8px] text-[1rem] font-bold text-secondary/80 xl:text-[1.25rem]">
            The Travel
          </h3>
          <p className="mb-[16px] text-[0.875rem] font-medium text-secondary/70 md:text-[1rem]">
            Get inspired! Receive travel discounts, tips and behind the scenes
            stories.
          </p>
          <div>
            {subscribed ? (
              <h3 className="rounded-[8px] bg-primary px-[16px] py-[8px] text-xl font-bold text-white">
                Thank you for your subscription!!&nbsp;
              </h3>
            ) : (
              <form
                method="GET"
                action="/api/subscribe"
                className="flex h-[40px] gap-[16px] lg:h-[56px]"
              >
                <Input
                  label={""}
                  error={
                    isValidE === false &&
                    isValidE !== null &&
                    "please enter a valid email"
                  }
                  autoComplete="off"
                  name="subscribe"
                  type="email"
                  placeholder="Your email address"
                  onChange={handleChange}
                  className={"grow"}
                />

                <Button
                  variant="secondary"
                  className={
                    "h-full grow-0 disabled:bg-[#D2D1D3] disabled:text-[#8F8C91]"
                  }
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
        <div className="flex h-full items-end self-end max-md:hidden">
          <Image
            className="h-auto max-h-full"
            src={mailbox}
            alt="mailbox"
            width={500}
            height={500}
          />
        </div>
      </section>
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
          backgroundColor: "#8DD3BB",
          height: height + "px",
        }}
      ></div>
    </>
  );
}
