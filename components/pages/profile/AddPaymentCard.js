"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { InfoIcon, Loader2 } from "lucide-react";
import { toast } from "../../ui/use-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);
export function AddPaymentCard({
  customAddButtonElement,
  className,
  reloadSection = () => {},
}) {
  const [setupIntentData, setSetupIntentData] = useState({
    clientSecret: null,
    customerId: null,
  });
  const [fetchingError, setFetchingError] = useState(false);
  const [tryAgain, setTryAgain] = useState(1);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (opened) {
      getSetupIntent();
    }
    async function getSetupIntent() {
      let idempotencyKey = sessionStorage.getItem("idempotencyKey");
      if (!idempotencyKey) {
        idempotencyKey = Date.now().toString();
        sessionStorage.setItem("idempotencyKey", idempotencyKey);
      }

      try {
        setLoading(true);
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/stripe/setup_intent",
          {
            method: "POST",
            body: JSON.stringify({ idempotencyKey }),
            next: { revalidate: 0 },
          },
        );

        if (!res.ok) {
          setFetchingError(true);
          toast({
            title: "Error",
            description: "An error occurred, please try again",
            variant: "destructive",
          });
          return;
        }
        const data = await res.json();

        if (data.success === false) {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          });
          return;
        }
        setSetupIntentData({
          clientSecret: data.data.clientSecret,
          customerId: data.data.customerId,
        });
        setFetchingError(false);
        setLoading(false);
        if (data.data.idempotencyKey !== idempotencyKey) {
          sessionStorage.setItem("idempotencyKey", data.idempotencyKey);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        setLoading(false);
        setFetchingError(true);
      }
    }

    return () => controller.abort();
  }, [tryAgain, opened]);

  return (
    <div>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild title="Add a new card">
          {customAddButtonElement ? (
            customAddButtonElement
          ) : (
            <div
              className={cn(
                "flex h-[212px] w-[378px] cursor-pointer items-center justify-center rounded-[16px] border-2 border-dashed border-primary",
                className,
              )}
            >
              <div className="flex flex-col items-center text-center">
                <svg
                  width="50"
                  height="51"
                  viewBox="0 0 50 51"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M49 25.5C49 12.25 38.25 1.5 25 1.5C11.75 1.5 1 12.25 1 25.5C1 38.75 11.75 49.5 25 49.5C38.25 49.5 49 38.75 49 25.5Z"
                    stroke="#8DD3BB"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M25 15.5V35.5M35 25.5H15"
                    stroke="#8DD3BB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Add a new card</p>
              </div>
            </div>
          )}
        </DialogTrigger>

        <DialogContent>
          {loading && <AddPaymentCardLoadingSkeleton />}

          {!loading &&
            (fetchingError ? (
              <>
                <DialogHeader>
                  <DialogTitle>Something went wrong</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  An error occurred during fetching necessary data to add a
                  card. Please try again
                </DialogDescription>
                <Button
                  onClick={() => {
                    setTryAgain(tryAgain + 1);
                  }}
                >
                  Try again
                </Button>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Add a new card</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-between rounded-md bg-cyan-300 p-3 text-sm font-medium text-cyan-800">
                  <div className="flex items-center gap-2">
                    <InfoIcon className="h-4 w-4" />
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
                  options={{ clientSecret: setupIntentData.clientSecret }}
                >
                  <Form
                    clientSecret={setupIntentData.clientSecret}
                    customerId={setupIntentData.customerId}
                    tryAgain={setTryAgain}
                    setOpened={setOpened}
                    reloadSection={reloadSection}
                  />
                </Elements>
              </>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const cardStyles = {
  showIcon: true,
  classes: {
    base: "font-monserrat h-fit p-3 lg:p-5 w-full rounded-md border-2 border-black bg-background px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
    invalid: "border-destructive text-destructive",
  },
  style: {
    base: {
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
  },
};

function Form({
  className,
  clientSecret,
  setOpened = () => {},
  tryAgain = () => {},
  reloadSection = () => {},
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [errors, setErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [adding, setAdding] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setAdding(true);
    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement("cardNumber"),
      },
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/profile`,
    });

    setAdding(false);

    if (result?.error) {
      if (result?.error?.type !== "validation_error") {
        toast({
          title: "Error",
          description: result?.error?.message,
          variant: "destructive",
        });
        tryAgain(Date.now());
      }
    } else {
      elements.getElement("cardNumber").clear();
      toast({
        title: "Success",
        description: "Card added successfully",
        variant: "default",
      });
      sessionStorage.removeItem("idempotencyKey");
      setOpened(false);
      reloadSection();
    }
  }

  function handleChange(e) {
    setErrors((prev) => ({
      ...prev,
      [e.elementType]: e.error ? e.error.message : "",
    }));
  }
  return !stripe || !elements ? (
    <div className="flex h-[300px] items-center justify-center">
      <Loader2 />
    </div>
  ) : (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
            Card Number
          </span>
          <CardNumberElement onChange={handleChange} options={cardStyles} />
          <p className="text-xs text-destructive">{errors?.cardNumber}&nbsp;</p>
        </div>
        <div className="relative">
          <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
            Card Expiry
          </span>
          <CardExpiryElement onChange={handleChange} options={cardStyles} />
          <p className="text-xs text-destructive">{errors?.cardExpiry}&nbsp;</p>
        </div>
        <div className="relative">
          <span className="absolute -top-[8px] left-5 z-10 bg-background px-1 text-sm font-normal leading-4">
            CVC
          </span>
          <CardCvcElement onChange={handleChange} options={cardStyles} />
          <p className="text-xs text-destructive">{errors?.cardCvc}&nbsp;</p>
        </div>
      </div>

      <Button disabled={adding} type="submit" className="w-full">
        {adding ? "Adding..." : "Add Card"}
      </Button>
    </form>
  );
}

function AddPaymentCardLoadingSkeleton() {
  return (
    <div className={"flex flex-col gap-6"}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <Skeleton className={"mb-2 h-4 w-[100px]"} />
          <Skeleton className={"h-[48px]"} />
        </div>
        <div className="grow">
          <Skeleton className={"mb-2 h-4 w-[100px]"} />
          <Skeleton className={"h-[48px]"} />
        </div>
        <div className="grow">
          <Skeleton className={"mb-2 h-4 w-[100px]"} />
          <Skeleton className={"h-[48px]"} />
        </div>
      </div>

      <Skeleton className={"h-[48px]"} />
    </div>
  );
}
