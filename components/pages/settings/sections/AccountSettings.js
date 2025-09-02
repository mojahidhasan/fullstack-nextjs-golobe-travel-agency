import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteAccountPopupForm from "../ui/DeleteAccountPopupForm";
import { isDateObjValid } from "@/lib/utils";
import { VerifyEmailBtn } from "../../profile/ui/VerifyEmailBtn";
import { cookies } from "next/headers";

export default async function AccountSettings({ userDetails }) {
  const sendAgainAt = cookies().get("sai")?.expires?.toISOString();
  const subscription = {
    plan: "Basic",
    renewalDate: "2025-07-01",
  };

  const primaryEmail = userDetails.emails.find((email) => email.primary);

  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {/* Login Email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Login Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-x-2">
            <span className="font-medium">{primaryEmail.email}</span>
            <VerifyEmailBtn
              email={primaryEmail.email}
              sendAgainAt={sendAgainAt}
            />
          </div>
          <p
            className={`text-sm ${isDateObjValid(primaryEmail.emailVerifiedAt) ? "text-green-600" : "text-red-600"}`}
          >
            {isDateObjValid(primaryEmail.emailVerifiedAt)
              ? "Verified"
              : "Not Verified"}
          </p>
        </CardContent>
      </Card>

      {/* Subscription Plan */}
      <Card className="opacity-30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Subscription Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            Current Plan: <strong>{subscription.plan}</strong>
          </p>
          <p>Next Renewal Date: {subscription.renewalDate}</p>
          <Button disabled>Change / Upgrade Plan</Button>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <DeleteAccountPopupForm />
    </div>
  );
}
