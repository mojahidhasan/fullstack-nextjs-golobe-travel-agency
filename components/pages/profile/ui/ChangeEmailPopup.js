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

import { updateEmailAction } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { ChangeButton } from "./ChangeButton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function ChangeEmailPopup({ emails }) {
  const [state, dispatch] = useFormState(updateEmailAction, null);
  const [opened, setOpened] = useState(false);
  const [isEmailsEdited, setIsEmailsEdited] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    const obj = {};

    emails?.forEach((email) => {
      obj[`${email.email}`] = false;
    });

    setIsEmailsEdited(obj);
  }, [emails]);

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

  function handleEditEmail(email, ev) {
    const obj = { ...isEmailsEdited };

    Object.keys(obj).forEach((key) => {
      if (key !== email) {
        obj[key] = false;
      } else {
        obj[key] = true;
      }
    });
    setIsEmailsEdited(obj);
  }

  function handleCancelEditEmail(email, ev) {
    setIsEmailsEdited({
      ...isEmailsEdited,
      [email]: false,
    });
  }

  return (
    <Dialog open={opened} onOpenChange={setOpened}>
      <DialogTrigger asChild>
        <ChangeButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Update your email</DialogTitle>
          <DialogDescription>
            Make changes to your email here. Click save when you&apos;re done.
          </DialogDescription>
          {state?.success === false && state?.message && (
            <ErrorMessage message={state?.message} />
          )}
        </DialogHeader>
        <div
          className={
            "flex flex-col gap-4 overflow-y-auto golobe-scrollbar pr-2 pt-2"
          }
        >
          {emails?.map((email, i) => (
            <div key={i}>
              {isEmailsEdited[`${email.email}`] ? (
                <form
                  id={email.email}
                  action={dispatch}
                  className={"flex justify-start items-start flex-col gap-2"}
                >
                  <input
                    type={"hidden"}
                    name={"prevEmail"}
                    value={email.email}
                  />
                  <Input
                    type="email"
                    name="email"
                    defaultValue={email.email}
                    label={"Email"}
                    error={state?.error?.email}
                    className={"w-full"}
                  />
                  <div className={"flex gap-2"}>
                    <SubmitBtn formId={email.email} />
                    <Button
                      type="button"
                      variant={"outline"}
                      size={"lg"}
                      onClick={(e) => handleCancelEditEmail(email.email, e)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{email.email}</p>
                  {email.primary === true && (
                    <p className="text-sm font-semibold text-muted-foreground">
                      Primary
                    </p>
                  )}
                  {email.primary === false && (
                    <Button
                      type="button"
                      size={"icon"}
                      onClick={(e) => handleEditEmail(email.email, e)}
                    >
                      <Edit />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
