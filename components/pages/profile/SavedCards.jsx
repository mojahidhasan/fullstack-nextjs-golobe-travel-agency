"use client";
import { TabContentMockup } from "@/components/pages/profile/ui/TabContentMockup";
import { PaymentCard } from "@/components/pages/profile/ui/PaymentCard";
import { AddPaymentCard } from "@/components/pages/profile/AddPaymentCard";
import { Button } from "@/components/ui/button";
import useFetchCards from "@/lib/hooks/useFetchCards";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
export default function SavedCards() {
  const { loading, cardData, fetchError, tryAgain } = useFetchCards();

  return (
    <TabContentMockup title={"Payment Methods"}>
      <div className="mx-auto flex w-auto flex-wrap justify-center gap-[12px] rounded-[12px] bg-white p-3 shadow-md">
        {loading && (
          <>
            <Skeleton className="h-[212px] min-h-[200px] w-[378px] min-w-[300px] rounded-[16px]" />
          </>
        )}
        {!loading &&
          (fetchError.status === true ? (
            <div
              role="alert"
              className="mx-auto flex flex-col items-center justify-center gap-4 rounded-xl bg-red-100 p-6 text-red-800 shadow-md"
            >
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <AlertCircle className="h-6 w-6" />
                <span>Oops! Something went wrong</span>
              </div>
              <p className="text-center text-base font-medium">
                {fetchError.message ||
                  "We couldn't load the data. Please try again."}
              </p>
              <Button onClick={tryAgain} variant="destructive">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {cardData.length === 0 && <NoSavedCardsMessage />}
              {cardData.map((card) => (
                <PaymentCard key={card.id} card={card} tryAgain={tryAgain} />
              ))}
            </>
          ))}
        <AddPaymentCard reloadSection={tryAgain} />
      </div>
    </TabContentMockup>
  );
}
function NoSavedCardsMessage() {
  return (
    <div className="flex h-[212px] min-h-[200px] w-[378px] min-w-[300px] flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div className="text-center text-2xl font-semibold">
        No Saved Payment Methods
      </div>
      <p className="max-w-md text-center text-base">
        You haven&apos;t added any saved cards yet. You can proceed by adding a
        new payment method below.
      </p>
    </div>
  );
}
