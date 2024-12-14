import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs";

import { AccountDetails } from "@/components/pages/profile/AccountDetails";
import { TicketsOrBookings } from "@/components/pages/profile/TicketsOrBookings";
import { PaymentMethods } from "@/components/pages/profile/PaymentMethods";

export function ProfileData({ userDetails, tab }) {
  return (
    <Tabs className="w-full bg-transparent p-0" defaultValue={ tab || "account" }>
      <TabsList className="bg-transparent xsm:flex-row flex-col mb-4 bg-white shadow-md p-0 gap-1 flex justify-start h-auto">
        <TabsTrigger
          value="account"
          className="md:h-[60px] font-bold h-[48px] w-full grow gap-2"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="tickets/bookings"
          className="md:h-[60px] font-bold h-[48px] max-xsm:text-wrap w-full grow gap-2"
        >
          Tickets / Bookings
        </TabsTrigger>
        <TabsTrigger
          value="payment_methods"
          className="md:h-[60px] font-bold h-[48px] max-xsm:text-wrap w-full grow gap-2"
        >
          Payment Methods
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="account"
      >
        <AccountDetails userDetails={ userDetails } />
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
