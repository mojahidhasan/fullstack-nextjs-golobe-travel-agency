"use client";

import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";
function RoomDetailsModal({ customTriggerElement, roomDetails = {} }) {
  const {
    images = [],
    description,
    features = [],
    amenities = [],
    price = {},
    sleepsCount,
    totalBeds,
    bedOptions,
    smokingAllowed,
    maxAdults,
    maxChildren,
    extraBedAllowed,
    roomNumber,
    roomType,
    floor,
  } = roomDetails;

  const [open, setOpen] = useState(false);

  const sanitizeUrl = (url) =>
    typeof url === "string" && url.startsWith("http")
      ? url
      : "/placeholder.png";

  const truncateText = (text, limit = 180) => {
    if (!text) return "N/A";
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customTriggerElement || <Button>Details</Button>}
      </DialogTrigger>
      <DialogContent className="golobe-scrollbar max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-2 text-2xl font-bold">
            Room Details
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-6">
              <div className="mx-auto max-w-[80%] sm:max-w-[90%]">
                {images.length > 0 && (
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[Autoplay({ delay: 5000 })]}
                  >
                    <CarouselPrevious />
                    <CarouselContent>
                      {images.map((img, i) => (
                        <CarouselItem key={i} className="flex justify-center">
                          <Image
                            src={sanitizeUrl(img)}
                            alt={`Room image ${i + 1}`}
                            width={1000}
                            height={1000}
                            className="aspect-video w-full rounded-lg object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselNext />
                  </Carousel>
                )}
              </div>

              <div>
                <h3 className="mb-1 text-lg font-semibold">Description</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="cursor-help text-sm text-muted-foreground">
                        {truncateText(description)}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p>{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pricing</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Base:</strong> {price.currency || "USD"}{" "}
                    {price.base}
                  </li>
                  {price.tax > 0 && (
                    <li>
                      <strong>Tax:</strong> {price.tax}
                    </li>
                  )}
                  {price.serviceFee > 0 && (
                    <li>
                      <strong>Service Fee:</strong> {price.serviceFee}
                    </li>
                  )}
                  {price.discount?.amount && (
                    <li>
                      <strong>Discount:</strong>{" "}
                      {price.discount.type === "percentage"
                        ? `${price.discount.amount}%`
                        : `${price.discount.amount} ${price.currency || "USD"}`}
                      {price.discount.validUntil &&
                        ` (until ${new Date(price.discount.validUntil).toLocaleDateString()})`}
                    </li>
                  )}
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold">General</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>Room Type:</strong> {roomType || "N/A"}
                    </li>
                    <li>
                      <strong>Room Number:</strong> {roomNumber || "N/A"}
                    </li>
                    <li>
                      <strong>Floor:</strong> {floor ?? "N/A"}
                    </li>
                    <li>
                      <strong>Total Beds:</strong> {totalBeds}
                    </li>
                    <li>
                      <strong>Bed Options:</strong> {bedOptions || "N/A"}
                    </li>
                    <li>
                      <strong>Sleeps:</strong> {sleepsCount}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Restrictions</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>Smoking Allowed:</strong>{" "}
                      {smokingAllowed ? "Yes" : "No"}
                    </li>
                    <li>
                      <strong>Extra Bed:</strong>{" "}
                      {extraBedAllowed ? "Available" : "Not allowed"}
                    </li>
                    <li>
                      <strong>Max Adults:</strong> {maxAdults ?? "N/A"}
                    </li>
                    <li>
                      <strong>Max Children:</strong> {maxChildren ?? "N/A"}
                    </li>
                  </ul>
                </div>
              </div>

              {features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Features</h3>
                  <ul className="list-inside list-disc text-sm text-muted-foreground sm:columns-2">
                    {features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Amenities</h3>
                  <ul className="list-inside list-disc text-sm text-muted-foreground sm:columns-2">
                    {amenities.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RoomDetailsModal;
