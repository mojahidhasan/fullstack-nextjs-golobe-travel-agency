import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs";

import { AccountDetails } from "@/components/pages/profile/AccountDetails";
import { TicketsOrBookings } from "@/components/pages/profile/TicketsOrBookings";
import SavedCards from "./SavedCards";

export function ProfileData({ userDetails, tab }) {
  return (
    <Tabs className="w-full bg-transparent p-0" defaultValue={tab || "account"}>
      <TabsList className="mb-4 flex h-auto flex-col justify-start gap-1 bg-transparent bg-white p-0 shadow-md xsm:flex-row">
        <TabsTrigger
          value="account"
          className="h-[48px] w-full grow gap-2 font-bold md:h-[60px]"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="tickets/bookings"
          className="h-[48px] w-full grow gap-2 font-bold max-xsm:text-wrap md:h-[60px]"
        >
          Tickets / Bookings
        </TabsTrigger>
        <TabsTrigger
          value="payment_methods"
          className="h-[48px] w-full grow gap-2 font-bold max-xsm:text-wrap md:h-[60px]"
        >
          Payment Methods
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <AccountDetails userDetails={userDetails} />
      </TabsContent>
      <TabsContent value="tickets/bookings">
        <TicketsOrBookings />
      </TabsContent>
      <TabsContent value="payment_methods">
        <SavedCards />
      </TabsContent>
    </Tabs>
  );
}
