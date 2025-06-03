"use client";

import useFetchCards from "@/lib/hooks/useFetchCards";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { ErrorMessage } from "../local-ui/errorMessage";
import Link from "next/link";
import { toast } from "../ui/use-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);
export default function PayWithSavedCard({
  onSuccess = () => {},
  middleware = async (next = () => {}) => {}, // runs before confirming the payment
  loading: paymentIntentsLoading,
  error,
  paymentIntents,
  paymentStatus,
  retry = () => {},
}) {
  const {
    loading: cardsLoading,
    cardData,
    fetchError,
    tryAgain,
  } = useFetchCards();
  if (cardsLoading || paymentIntentsLoading) return <LoadingSkeleton />;
  if (paymentStatus === "succeeded") return <PaymentSuccessMessage />;
  if (error) {
    return <FetchErrorMessage tryAgain={retry}>{error}</FetchErrorMessage>;
  }
  if (fetchError.status === true) {
    return (
      <FetchErrorMessage tryAgain={tryAgain}>
        {fetchError.message}
      </FetchErrorMessage>
    );
  }
  if (!paymentIntentsLoading && !cardsLoading && cardData.length === 0) {
    return <NoSavedCardsMessage />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: paymentIntents?.client_secret,
      }}
    >
      <TheForm
        onSuccess={onSuccess}
        middleware={middleware}
        cardData={cardData}
        amount={paymentIntents?.amount}
        currency={paymentIntents?.currency}
        clientSecret={paymentIntents?.client_secret}
      />
    </Elements>
  );
}

function TheForm({
  onSuccess,
  cardData,
  amount,
  currency,
  clientSecret,
  middleware,
}) {
  const pathname = usePathname();
  const stripe = useStripe();

  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !paymentMethodId) {
      return;
    }
    setPaying(true);

    await middleware(async () => {
      await confirmPayment(clientSecret, paymentMethodId);
    });
    setPaying(false);
  };

  async function confirmPayment(clientSecret, paymentMethodId) {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    });
    if (result.error) {
      if (result.error.payment_intent.status === "succeeded") {
        window.location.reload();
        return;
      }

      setError(result.error.message);
      toast({
        title: "Error",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      onSuccess();
    }
  }
  return (
    <>
      {!paymentMethodId && <ErrorMessage message="Please select a card" />}
      {error && <ErrorMessage message={error} />}
      <div className="rounded-[12px] p-3">
        <form onSubmit={handleSubmit}>
          <RadioGroup onValueChange={setPaymentMethodId}>
            {cardData.map((data) => (
              <Label
                key={data.id}
                className="flex grow items-center justify-between gap-[32px] rounded-[12px] border border-primary p-4 has-[[data-state='checked']]:bg-primary"
              >
                <div className="flex items-center gap-3">
                  <Image
                    width={70}
                    height={70}
                    src={`/icons/cards/${data.cardType}.svg`}
                    alt={`${data.cardType}_icon`}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xl font-bold">
                      **** **** **** {data.last4Digits}
                    </p>
                    <p className="text-sm font-bold">
                      Expires {data.validTill}
                    </p>
                  </div>
                </div>
                <RadioGroupItem
                  className="border-2 data-[state='checked']:border-white data-[state='checked']:text-white"
                  value={data.id}
                />
              </Label>
            ))}
          </RadioGroup>
          <div className="mt-6 flex justify-center">
            <Button disabled={!paymentMethodId || paying} className="w-[200px]">
              Pay {amount / 100} {currency}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-2 rounded-[12px] border border-gray-200 bg-gray-100 p-4"
        >
          <div className="flex grow items-center gap-3">
            <Skeleton className="h-10 w-[60px]" />
            <div className="flex grow flex-col gap-2">
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
      ))}
      <div className="mt-6 flex justify-center">
        <Button className="w-[200px]">Pay</Button>
      </div>
    </div>
  );
}

function NoSavedCardsMessage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gray-50 p-6 text-gray-700 shadow-inner">
      <div className="text-2xl font-semibold">No Saved Payment Methods</div>
      <p className="max-w-md text-center text-base">
        You haven&apos;t added any saved cards yet. You can proceed by adding a
        new payment method below.
      </p>
    </div>
  );
}

function FetchErrorMessage({ children, tryAgain = () => {} }) {
  return (
    <div
      role="alert"
      className="mx-auto flex flex-col items-center justify-center gap-4 rounded-xl bg-red-100 p-6 text-red-800 shadow-md"
    >
      <div className="flex items-center gap-2 text-2xl font-semibold">
        <AlertCircle className="h-6 w-6" />
        <span>Oops! Something went wrong</span>
      </div>
      <div className="text-center text-base font-medium">
        {children || "We couldn't load the data. Please try again."}
      </div>
      <Button onClick={tryAgain} variant="destructive">
        Try Again
      </Button>
    </div>
  );
}
function PaymentSuccessMessage({ children }) {
  return (
    <div
      role="status"
      className="mx-auto flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-primary bg-[#f3fbf8] p-6 text-primary shadow-md"
    >
      <div className="flex items-center gap-2 text-2xl font-semibold">
        <CheckCircleIcon className="h-6 w-6" />
        <span>Success</span>
      </div>
      <div className="text-center text-base font-medium">
        {children || "Payment successful"}
      </div>
    </div>
  );
}
