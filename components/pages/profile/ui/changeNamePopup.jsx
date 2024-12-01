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

import { updateNameAction } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { ChangeButton } from "./ChangeButton";
export function ChangeNamePopup({ firstname, lastname }) {
  const [state, dispatch] = useFormState(updateNameAction, null);
  const [opened, setOpened] = useState(false);
  const { toast } = useToast();
  let errors = {};

  if (state?.error === "validation_error") {
    for (let key in state?.message) {
      errors[state?.message[key].path[0]] = state?.message[key].message;
    }
  }

  useEffect(() => {
    if (state?.success) {
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
    <Dialog open={ opened } onOpenChange={ setOpened }>
      <DialogTrigger asChild>
        <ChangeButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit name</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
          { state?.error === "change_name_error" && (
            <ErrorMessage message={ state?.message } />
          ) }
        </DialogHeader>
        <form id="change-name-form" action={ dispatch }>
          <div className="grid gap-4 py-4">
            <Input
              id="firstname-hsviuxwv"
              name="firstname"
              label="First name"
              defaultValue={ firstname }
              error={ errors?.firstname }
            />
            <Input
              id="lastname-sjvch"
              label="Last name"
              name="lastname"
              defaultValue={ lastname }
              error={ errors?.lastname }
            />
          </div>
          <DialogFooter>
            <SubmitBtn customTitle={ { default: "Save", onSubmitting: "Saving..." } } formId={ "change-name-form" } />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
