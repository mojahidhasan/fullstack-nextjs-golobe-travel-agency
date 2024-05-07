import { AddPaymentCardForm } from "@/components/AddPaymentCardForm";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function AddPaymentCard({ className }) {
  return (
    <div
      className={cn(
        "flex h-[212px] w-[378px] items-center justify-center rounded-[16px] border-2 border-dashed border-primary",
        className
      )}
    >
      <div className="text-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button asChild variant="icon" className={"h-auto p-0 w-auto"}>
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
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AddPaymentCardForm />
            <DialogFooter>
              <p className="text-[0.75rem] opacity-75">
                By confirming your subscription, you allow The Outdoor Inn Crowd
                Limited to charge your card for this payment and future payments
                in accordance with their terms. You can always cancel your
                subscription.
              </p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <p>Add a new card</p>
      </div>
    </div>
  );
}
