"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { useState } from "react";

import { debounce } from "@/lib/utils";
export function AddPromoCode({ defaultCode = "", getPromoCode = () => {} }) {
  const [open, setOpen] = useState(false);
  const [promo, setPromo] = useState(defaultCode);
  return (
    <Dialog
      open={open}
      onOpenChange={(s) => {
        setOpen(!open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="link" className="gap-1">
          <Image alt="plus_icon" width={24} height={24} src="/icons/add.svg" />
          <span>Add Promo Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Promo Code</DialogTitle>
          <DialogDescription>
            Add a new promo code to your account to get discounts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Promo Code
          </Label>
          <Input
            form="flightform"
            id="name"
            name="promocode"
            className="col-span-3"
            defaultValue={defaultCode}
            onChange={debounce((e) => {
              setPromo(e.target.value);
            }, 200)}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              setOpen(false);
              getPromoCode(promo);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
