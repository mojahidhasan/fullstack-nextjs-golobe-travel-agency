"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import cancelHotelBookingAction from "@/lib/actions/cancelHotelBookingAction";
import requestRefundHotelBookingAction from "@/lib/actions/requestRefundHotelBookingAction";

export function CancelHotelBookingButton({ bookingId }) {
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
    e.target.disabled = false;
  }
  return (
    <Button onClick={handleCancel} variant="destructive">
      Cancel Booking
    </Button>
  );
}

export function RequestRefundHotelBookingButton({ bookingId }) {
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
    e.target.disabled = false;
  }
  return (
    <Button
      onClick={handleRequest}
      className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
      variant="outline"
    >
      Request Refund
    </Button>
  );
}
