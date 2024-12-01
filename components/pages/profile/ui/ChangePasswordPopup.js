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

import { updatePasswordAction } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { ChangeButton } from "./ChangeButton";
export function ChangePasswordPopup() {
  const [state, dispatch] = useFormState(updatePasswordAction, null);
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

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <ChangeButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update your password</DialogTitle>
          <DialogDescription>
            Make changes to your password here. Click save when you&apos;re
            done.
          </DialogDescription>
          {state?.success === false && state?.message && (
            <ErrorMessage message={state?.message} />
          )}
        </DialogHeader>
        <form id="change-password-form" action={dispatch}>
          <div className="grid gap-4 py-4">
            <Input
              id="currentPassword-hsviuxwv"
              name="currentPassword"
              label="Current Password"
              placeholder="Enter your current password"
              error={state?.error?.currentPassword}
              type={"password"}
            />
            <Input
              id="newPassword-sjvch"
              label="New Password"
              name="newPassword"
              placeholder="Enter new password"
              error={state?.error?.newPassword}
              type={"password"}
            />
            <Input
              id="confirmPassword-sjvch"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Enter new password again"
              error={state?.error?.confirmPassword}
              type={"password"}
            />
          </div>
          <DialogFooter>
            <SubmitBtn
              customTitle={{ default: "Save", onSubmitting: "Saving..." }}
              formId={"change-password-form"}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
