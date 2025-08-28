"use client";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import requestRefundFlightBookingAction from "@/lib/actions/requestRefundFlightBookingAction";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function RequestRefundFlightBtn({ pnrCode, className }) {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  async function handleClick(e) {
    e.target.disabled = true;
    setIsSending(true);
    const res = await requestRefundFlightBookingAction(pnrCode);
    e.target.disabled = false;
    setIsSending(false);
    setOpen(false);
    if (res?.success === false) {
      toast({
        title: "Error",
        description: res?.message,
        variant: "destructive",
      });
    }

    if (res?.success === true) {
      toast({
        title: "Success",
        description: res?.message,
        variant: "default",
      });
    }
  }
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button
          className={cn(
            "border-green-600 text-green-600 hover:bg-green-600 hover:text-white",
            className,
          )}
          disabled={isSending}
          variant="outline"
          onClick={() => setOpen(true)}
        >
          Request Refund
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will request refund for your booking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClick}
            className="bg-green-600 text-white hover:bg-green-600/90 focus:bg-green-600/90 active:bg-green-600/90 disabled:bg-disabled disabled:text-disabled-foreground"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
