"use client";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/local-ui/input";
import { ErrorMessage } from "@/components/local-ui/errorMessage";
import { SubmitBtn } from "@/components/local-ui/SubmitBtn";
import { useToast } from "@/components/ui/use-toast";
import { deleteAccountAction } from "@/lib/actions";

export default function DeleteAccountSection() {
  const [state, dispatch] = useFormState(deleteAccountAction, null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success === true) {
      toast({
        title: "Success",
        description: state.message,
        variant: "default",
      });
      setTimeout(() => window.location.reload(), 2000);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-red-600">
          Delete Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Deleting your account is irreversible. All your data will be
          permanently removed.
        </p>

        {!showForm ? (
          <Button variant="destructive" onClick={() => setShowForm(true)}>
            Delete Account
          </Button>
        ) : (
          <form
            id="delete-account-form"
            action={dispatch}
            className="space-y-4"
          >
            {state?.success === false && state?.message && (
              <ErrorMessage message={state.message} />
            )}
            <Input
              id="primaryEmail"
              name="primaryEmail"
              label="Primary Email"
              placeholder="Enter your primary email"
              type="email"
              error={state?.error?.primaryEmail}
              className="w-full"
            />
            <Input
              id="password"
              name="password"
              label="Password"
              placeholder="Enter password"
              type="password"
              error={state?.error?.password}
              className="w-full"
            />
            <Input
              id="delete"
              name="delete"
              label='Type "DELETE" to confirm'
              placeholder="Type DELETE"
              type="text"
              error={state?.error?.delete}
              className="w-full"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <SubmitBtn
                variant="destructive"
                formId={"delete-account-form"}
                customTitle={{
                  default: "Delete Account",
                  onSubmitting: "Deleting...",
                }}
              />
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
