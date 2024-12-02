"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

import { Input } from "@/components/local-ui/input";

import { addNewEmailAction } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { Button } from "@/components/ui/button";

export function AddAnotherEmailPopup() {
  const [state, dispatch] = useFormState(addNewEmailAction, null);
  const [opened, setOpened] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === true) {
      setTimeout(() => {
        setOpened(false);
        toast({
          title: "Success",
          description: state?.message,
          variant: "default",
        });
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const handleSubmit = async (e) => {
    toast({
      title: "Saving",
      description: "Please wait while we save your changes",
      variant: "info",
    });
  };
  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={"gap-1 p-2 h-auto"}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.523438 7C0.523438 3.42888 3.42888 0.523438 7 0.523438C10.5711 0.523438 13.4766 3.42888 13.4766 7C13.4766 10.5711 10.5711 13.4766 7 13.4766C3.42888 13.4766 0.523438 10.5711 0.523438 7ZM7.52344 9.5V7.52344H9.5C9.63882 7.52344 9.77196 7.46829 9.87013 7.37013C9.96829 7.27196 10.0234 7.13882 10.0234 7C10.0234 6.86118 9.96829 6.72804 9.87013 6.62987C9.77196 6.53171 9.63882 6.47656 9.5 6.47656H7.52344V4.5C7.52344 4.36118 7.46829 4.22804 7.37013 4.12987C7.27196 4.03171 7.13882 3.97656 7 3.97656C6.86118 3.97656 6.72804 4.03171 6.62987 4.12987C6.53171 4.22804 6.47656 4.36118 6.47656 4.5V6.47656H4.5C4.36118 6.47656 4.22804 6.53171 4.12987 6.62987C4.03171 6.72804 3.97656 6.86118 3.97656 7C3.97656 7.13882 4.03171 7.27196 4.12987 7.37013C4.22804 7.46829 4.36118 7.52344 4.5 7.52344H6.47656V9.5C6.47656 9.63882 6.53171 9.77196 6.62987 9.87013C6.72804 9.96829 6.86118 10.0234 7 10.0234C7.13882 10.0234 7.27196 9.96829 7.37013 9.87013C7.46829 9.77196 7.52344 9.63882 7.52344 9.5Z"
              fill="black"
              stroke="#4C4850"
              strokeWidth="0.046875"
            />
          </svg>
          <span className="sm:inline hidden">Add another Email</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new email</DialogTitle>
          <DialogDescription>
            Make changes to your email here. Click save when you&apos;re done.
          </DialogDescription>
          {state?.success === false && state?.message && (
            <ErrorMessage message={state?.message} />
          )}
        </DialogHeader>
        <form id="add-email-form" action={dispatch} onSubmit={handleSubmit}>
          <Input
            label={"Email"}
            type={"email"}
            name="email"
            placeholder="Enter new email"
            className={"mb-3"}
            error={state?.error?.email}
          />
          <DialogFooter>
            <SubmitBtn
              type="submit"
              customTitle={{ default: "Save", onSubmitting: "Saving..." }}
              form="add-email-form"
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
