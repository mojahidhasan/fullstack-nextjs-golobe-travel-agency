import { TabContentMockup } from "@/components/pages/profile/ui/TabContentMockup";
import { PaymentCard } from "@/components/pages/profile/ui/PaymentCard";
import { AddPaymentCard } from "@/components/AddPaymentCard";
export function PaymentMethods() {
  const cardData = {
    last4Digits: "1234",
    validTill: "12/24",
    cardType: "Visa",
  };

  return (
    <TabContentMockup title={"Payment Methods"}>
      <div className="flex p-3 rounded-[12px] shadow-md bg-white justify-around flex-wrap gap-[12px]">
        <PaymentCard cardData={cardData} />
        <PaymentCard cardData={cardData} />
        <AddPaymentCard />
      </div>
    </TabContentMockup>
  );
}
