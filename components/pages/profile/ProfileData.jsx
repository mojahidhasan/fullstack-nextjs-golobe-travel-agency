"use client";

import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs";

import { AccoutDetails } from "@/components/pages/profile/AccoutDetails";
import { TicketsOrBookings } from "@/components/pages/profile/TicketsOrBookings";
import { PaymentMethods } from "@/components/pages/profile/PaymentMethods";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ProfileData({ userDetails }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (!currentTab) {
      router.replace("/profile?tab=account", {
        scroll: false,
      });
    }
  }, []);
  function changeTab(name) {
    router.replace("/profile?tab=" + name, {
      scroll: false,
    });
  }
  return (
    <Tabs
      className="w-full bg-transparent p-0"
      defaultValue={
        searchParams.has("tab") ? searchParams.get("tab") : "account"
      }
    >
      <TabsList className="bg-transparent xsm:flex-row flex-col mb-4 bg-white shadow-md p-0 flex justify-start h-auto">
        <TabsTrigger
          value="account"
          className="md:h-[60px] h-[48px] w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          onClick={() => {
            changeTab("account");
          }}
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="tickets/bookings"
          className="md:h-[60px] h-[48px] max-xsm:text-wrap w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          onClick={() => {
            changeTab("tickets/bookings");
          }}
        >
          Tickets / Bookings
        </TabsTrigger>
        <TabsTrigger
          value="payment_methods"
          className="md:h-[60px] h-[48px] max-xsm:text-wrap w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
          onClick={() => {
            changeTab("payment_methods");
          }}
        >
          Payment Methods
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="account"
        className="bg-white p-4 shadow-md rounded-[8px]"
      >
        <AccoutDetails userDetails={userDetails} />
      </TabsContent>
      <TabsContent value="tickets/bookings">
        <TicketsOrBookings />
      </TabsContent>
      <TabsContent value="payment_methods">
        <PaymentMethods />
      </TabsContent>
    </Tabs>
  );
}
