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
import cancelHotelBookingAction from "@/lib/actions/cancelHotelBookingAction";
import { confirmHotelBookingCashAction } from "@/lib/actions/confirmHotelBookingAction";
import requestRefundHotelBookingAction from "@/lib/actions/requestRefundHotelBookingAction";
import { useState } from "react";

export function CancelHotelBookingButton({ bookingId }) {
  const [open, setOpen] = useState(false);
  async function handleCancel(e) {
    e.target.disabled = true;
    const res = await cancelHotelBookingAction(bookingId);
    if (!res.success)
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    else toast({ title: "Success", description: res.message });
    setOpen(false);
    e.target.disabled = false;
  }
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="destructive">
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
            onClick={handleCancel}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:bg-destructive/90 active:bg-destructive/90 disabled:bg-disabled disabled:text-disabled-foreground"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RequestRefundHotelBookingButton({ bookingId }) {
  const [open, setOpen] = useState(false);
  async function handleRequest(e) {
    e.target.disabled = true;
    const res = await requestRefundHotelBookingAction(bookingId);
    if (!res.success)
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    else toast({ title: "Success", description: res.message });
    setOpen(false);
    e.target.disabled = false;
  }
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button
          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
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
            onClick={handleRequest}
            className="bg-green-600 text-white hover:bg-green-600/90 focus:bg-green-600/90 active:bg-green-600/90 disabled:bg-disabled disabled:text-disabled-foreground"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ConfirmNowPayAtHotelButton({ bookingId }) {
  function handleConfirm(e) {
    e.target.disabled = true;
    const res = confirmHotelBookingCashAction(bookingId);

    if (!res.success)
      toast({
        title: "Failed",
        description: res.message,
        variant: "destructive",
      });
    else toast({ title: "Success", description: res.message });

    e.target.disabled = false;
  }

  return <Button onClick={handleConfirm}>Confirm Now & Pay At Hotel</Button>;
}
