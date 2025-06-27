"use client";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { AlertCircle, CheckCircleIcon, Info } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export default function PayWithNewCardForm({
  onSuccess = () => {},
  middleware = async (next = async () => {}) => {}, // runs before confirming the payment
  loading,
  error,
  paymentIntents,
  paymentStatus,
  retry = () => {},
}) {
  if (paymentStatus === "succeeded") {
    return <PaymentSuccessMessage />;
  }

  return (
    <>
      {!loading ? (
        <>
          {error ? (
            <FetchErrorMessage tryAgain={retry}>{error}</FetchErrorMessage>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between rounded-md bg-cyan-300 p-3 text-sm font-medium text-cyan-800">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Use the following card numbers:
                  <Link
                    className="text-cyan-800 underline"
                    href={"https://stripe.com/docs/testing#cards"}
                    target="_blank"
                  >
                    Demo cards
                  </Link>
                </div>
              </div>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: paymentIntents?.client_secret }}
              >
                <CheckoutForm
                  amount={paymentIntents?.amount}
                  currency={paymentIntents?.currency}
                  middleware={middleware}
                  onSuccess={onSuccess}
                />
              </Elements>
            </>
          )}
        </>
      ) : (
        <PaymentFormSkeleton />
      )}
    </>
  );
}

function CheckoutForm({ amount, currency, middleware, onSuccess }) {
  const pathname = usePathname();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethodType, setPaymentMethodType] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    const saveCard = formData.get("save-card") === "on" ? true : false;

    setIsPaying(true);
    await middleware(async () => {
      await confirmPayment(saveCard);
    });
    setIsPaying(false);
  };

  async function confirmPayment(shouldSaveCard = false) {
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
        save_payment_method: shouldSaveCard,
      },
    });

    if (result.error) {
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
      {!isLoaded && <PaymentFormSkeleton />}
      <form
        id="payment-form"
        className="mx-auto max-w-[600px] rounded-lg border p-3"
        onSubmit={handleSubmit}
      >
        <PaymentElement
          onLoaderStart={() => setIsLoaded(true)}
          onChange={(e) => setPaymentMethodType(e.value.type)}
          options={{ layout: "tabs" }}
        />
        {elements && stripe && isLoaded && (
          <>
            {paymentMethodType === "card" && (
              <div className="mt-6">
                <Checkbox
                  label="Add this card to my account for future transactions"
                  id="save-card"
                  name="save-card"
                />
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button disabled={!stripe || isPaying} className="w-[200px]">
                Pay {amount / 100}&nbsp;
                <span className="uppercase">{currency}</span>
              </Button>
            </div>
          </>
        )}
      </form>
    </>
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

function PaymentFormSkeleton() {
  return (
    <div className="mx-auto max-w-[600px] rounded-lg border p-3">
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Skeleton className={"mb-2 h-4 w-[100px]"} />
          <Skeleton className={"h-14"} />
        </div>
        <div className="max-xsm:col-span-2">
          <Skeleton className={"mb-2 h-4 w-[100px]"} />
          <Skeleton className={"h-14 w-full"} />
        </div>
        <div className="max-xsm:col-span-2">
          <Skeleton className={"mb-2 h-4 w-[100px]"} />
          <Skeleton className={"h-14 w-full"} />
        </div>
        <div className="col-span-2">
          <Skeleton className={"mb-2 h-4 w-[100px]"} />
          <Skeleton className={"h-14"} />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className={"mb-2 h-4 w-4"} />
        <Skeleton className={"mb-2 h-4 w-[80%]"} />
      </div>
      <div className="mt-6 flex justify-center">
        <Skeleton className={"h-[48px] w-[200px]"} />
      </div>
    </div>
  );
}
