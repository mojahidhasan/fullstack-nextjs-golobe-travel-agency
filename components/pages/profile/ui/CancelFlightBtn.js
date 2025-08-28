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
import cancelFlightBookingAction from "@/lib/actions/cancelFlightBookingAction";
import { useState } from "react";

export default function CancelFlightBtn({ pnrCode, className }) {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  async function handleClick(e) {
    e.target.disabled = true;
    setIsSending(true);
    const res = await cancelFlightBookingAction(pnrCode);
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
          onClick={() => setOpen(true)}
          variant="destructive"
          disabled={isSending}
          className={className}
        >
          Cancel Booking
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will cancel your booking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClick}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:bg-destructive/90 active:bg-destructive/90 disabled:bg-disabled disabled:text-disabled-foreground"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
