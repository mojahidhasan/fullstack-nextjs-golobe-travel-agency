import { TabsTrigger, Tabs, TabsList, TabsContent } from "@/components/ui/tabs";

import { AccoutDetails } from "@/components/pages/profile/AccoutDetails";
import { TicketsOrBookings } from "@/components/pages/profile/TicketsOrBookings";
import { PaymentMethods } from "@/components/pages/profile/PaymentMethods";

export function ProfileData({ userDetails, tab }) {
  return (
    <Tabs className="w-full bg-transparent p-0" defaultValue={tab || "account"}>
      <TabsList className="bg-transparent xsm:flex-row flex-col mb-4 bg-white shadow-md p-0 flex justify-start h-auto">
        <TabsTrigger
          value="account"
          className="md:h-[60px] h-[48px] w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="tickets/bookings"
          className="md:h-[60px] h-[48px] max-xsm:text-wrap w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
        >
          Tickets / Bookings
        </TabsTrigger>
        <TabsTrigger
          value="payment_methods"
          className="md:h-[60px] h-[48px] max-xsm:text-wrap w-full grow gap-2 data-[state=active]:border-b-4 data-[state=active]:border-primary data-[state=active]:bg-primary/25"
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
