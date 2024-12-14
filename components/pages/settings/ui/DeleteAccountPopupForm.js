"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/local-ui/input";
import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { Button } from "@/components/ui/button";

import { deleteAccountAction } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function DeleteAccountPopupForm() {
  const [state, dispatch] = useFormState(deleteAccountAction, null);
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
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="mt-2">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            Enter you primary email and password to confirm deleting your
            account.
          </DialogDescription>
          {state?.success === false && state?.message && (
            <ErrorMessage message={state?.message} />
          )}
        </DialogHeader>
        <form
          id="delete-account-form"
          className={"flex flex-col gap-4"}
          action={dispatch}
        >
          <Input
            id="primaryEmail-hsvsdbciuxwv"
            name="primaryEmail"
            label="Primary Email"
            placeholder="Enter your primary email"
            error={state?.error?.primaryEmail}
            type={"email"}
            className={"w-full"}
          />
          <Input
            id="password-hsdvvbviuxwv"
            name="password"
            label="Password"
            placeholder="Enter password"
            error={state?.error?.password}
            type={"password"}
            className={"w-full"}
          />
          <Input
            id="delete-hsdvvbviuxwv"
            name="delete"
            label="Type DELETE to confirm"
            placeholder="Enter the word"
            error={state?.error?.delete}
            type={"text"}
            className={"w-full"}
          />
          <SubmitBtn
            variant={"destructive"}
            className={"bgred"}
            formId={"delete-account-form"}
            customTitle={{
              default: "Delete Account",
              onSubmitting: "Deleting...",
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
