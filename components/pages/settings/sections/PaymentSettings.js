"use client";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useFetchCards from "@/lib/hooks/useFetchCards";
import { EmptyResult } from "@/components/EmptyResult";
import { deletePaymentCardAction } from "@/lib/actions";
// import { Input } from "@/components/local-ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { AddPaymentCard } from "../../profile/AddPaymentCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function PaymentSettings() {
  // const [billingAddress, setBillingAddress] = useState("");
  // const [currency, setCurrency] = useState("USD");
  const { loading, fetchError, cardData, tryAgain } = useFetchCards();
  const [open, setOpen] = useState(false);

  async function handlePaymentCardDeleteClick(e, cardId) {
    e.target.disabled = true;
    const res = await deletePaymentCardAction(cardId);
    if (!res.success)
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    else {
      toast({ title: "Success", description: res.message });
      tryAgain();
    }
    setOpen(false);
    e.target.disabled = false;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Saved Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Saved Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading && (
            <div className="space-y-2">
              <Skeleton className={"h-[48px]"} />
              <Skeleton className={"h-[48px]"} />
              <Skeleton className={"h-[48px]"} />
            </div>
          )}
          {!loading && fetchError.status && <div>{fetchError.message}</div>}
          {!loading && !fetchError.status && cardData.length === 0 && (
            <EmptyResult
              className={"w-full"}
              message="No cards found."
              description={" "}
            />
          )}
          {!loading && !fetchError.status && cardData.length > 0 && (
            <div>
              {cardData.map((card) => (
                <div
                  key={card.id}
                  className="mb-2 flex items-center justify-between"
                >
                  <p className="flex items-center gap-2 font-medium">
                    <Image
                      src={"/icons/cards/" + card.cardType + ".svg"}
                      height={70}
                      width={70}
                      alt={card.cardType + "_icon"}
                    />
                    <span>**** **** **** {card.last4Digits}</span>
                  </p>
                  <AlertDialog open={open}>
                    <AlertDialogTrigger asChild title="Delete Payment Method">
                      <Button
                        onClick={() => setOpen(true)}
                        variant="icon"
                        title="Remove Payment Method"
                        className={"h-auto w-auto p-1 hover:text-destructive"}
                      >
                        <svg
                          width="22"
                          height="20"
                          viewBox="0 0 22 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 0.25H2C1.17157 0.25 0.5 0.921573 0.5 1.75V2.5C0.5 3.32843 1.17157 4 2 4H20C20.8284 4 21.5 3.32843 21.5 2.5V1.75C21.5 0.921573 20.8284 0.25 20 0.25Z"
                            fill="currentColor"
                          />
                          <path
                            d="M2.49031 5.50001C2.43761 5.49972 2.38544 5.51055 2.33721 5.53178C2.28898 5.55301 2.24576 5.58416 2.21038 5.62322C2.17499 5.66227 2.14824 5.70834 2.13186 5.75843C2.11548 5.80852 2.10984 5.8615 2.11531 5.91391L3.34859 17.7527C3.34833 17.7561 3.34833 17.7595 3.34859 17.763C3.41303 18.3105 3.67628 18.8154 4.08837 19.1817C4.50046 19.548 5.0327 19.7502 5.58406 19.75H16.4164C16.9676 19.75 17.4996 19.5477 17.9115 19.1814C18.3234 18.8151 18.5865 18.3104 18.6509 17.763V17.7531L19.8823 5.91391C19.8878 5.8615 19.8822 5.80852 19.8658 5.75843C19.8494 5.70834 19.8226 5.66227 19.7873 5.62322C19.7519 5.58416 19.7087 5.55301 19.6604 5.53178C19.6122 5.51055 19.56 5.49972 19.5073 5.50001H2.49031ZM14.1556 13.9698C14.2269 14.0391 14.2837 14.1219 14.3228 14.2133C14.3618 14.3048 14.3823 14.403 14.383 14.5024C14.3837 14.6019 14.3646 14.7004 14.3269 14.7924C14.2891 14.8844 14.2335 14.9679 14.1632 15.0382C14.0929 15.1085 14.0093 15.1641 13.9173 15.2018C13.8253 15.2395 13.7267 15.2585 13.6273 15.2577C13.5279 15.257 13.4296 15.2365 13.3382 15.1974C13.2468 15.1583 13.1641 15.1015 13.0948 15.0302L11.0005 12.9358L8.90562 15.0302C8.76432 15.1675 8.57467 15.2436 8.37766 15.2422C8.18065 15.2408 7.9921 15.162 7.85276 15.0227C7.71342 14.8834 7.63448 14.6949 7.633 14.4979C7.63151 14.3009 7.70761 14.1112 7.84484 13.9698L9.93968 11.875L7.84484 9.78016C7.70761 9.6388 7.63151 9.44912 7.633 9.25211C7.63448 9.0551 7.71342 8.86659 7.85276 8.72731C7.9921 8.58803 8.18065 8.50917 8.37766 8.50778C8.57467 8.50638 8.76432 8.58256 8.90562 8.71985L11.0005 10.8142L13.0948 8.71985C13.2361 8.58256 13.4258 8.50638 13.6228 8.50778C13.8198 8.50917 14.0084 8.58803 14.1477 8.72731C14.287 8.86659 14.366 9.0551 14.3675 9.25211C14.3689 9.44912 14.2928 9.6388 14.1556 9.78016L12.0608 11.875L14.1556 13.9698Z"
                            fill="currentColor"
                          />
                        </svg>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your card.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={(e) =>
                            handlePaymentCardDeleteClick(e, card.id)
                          }
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}

          <AddPaymentCard
            reloadSection={tryAgain}
            customAddButtonElement={
              <Button
                className="mt-4 text-secondary"
                size="sm"
                variant="outline"
              >
                Add New Payment Method
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Billing Address */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="textarea"
            label=""
            placeholder="123 Street Name, City, ZIP"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
          />
          <Button variant="outline">Save Address</Button>
        </CardContent>
      </Card> */}

      {/* Currency Preference */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Currency Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option>USD</option>
            <option>BDT</option>
            <option>EUR</option>
          </select>
        </CardContent>
      </Card> */}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-muted-foreground">
            You can download your payment history below.
          </p>
          <Button variant="outline">Download PDF</Button>
        </CardContent>
      </Card>
    </div>
  );
}
