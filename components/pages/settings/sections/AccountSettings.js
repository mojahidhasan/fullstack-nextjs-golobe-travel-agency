"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteAccountPopupForm from "../ui/DeleteAccountPopupForm";

export default function AccountSettings() {
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [accountStatus, setAccountStatus] = useState("Active"); // Active, Deactivated, Suspended

  const [subscription, setSubscription] = useState({
    plan: "Basic",
    renewalDate: "2025-07-01",
  });

  useEffect(() => {
    const fetchData = async () => {
      setEmail("mojahid@example.com");
      setEmailVerified(true);
      setAccountStatus("Active");
      setSubscription({ plan: "Basic", renewalDate: "2025-07-01" });
    };
    fetchData();
  }, []);

  const handleEmailSave = () => {
    // TODO: Save email change & trigger verification email if needed
    setEditingEmail(false);
    alert("Email updated successfully! Please verify your new email.");
  };

  const handlePasswordChange = () => {
    // TODO: Change password logic
    alert("Password changed successfully!");
    setPassword("");
  };

  const toggleAccountStatus = () => {
    // Toggle between Active and Deactivated for demo
    setAccountStatus((prev) => (prev === "Active" ? "Deactivated" : "Active"));
  };

  const handleSubscriptionChange = () => {
    // TODO: Implement subscription change or upgrade logic
    alert("Subscription plan updated!");
  };

  const confirmDeleteAccount = () => {
    // TODO: API call to delete account permanently
    setDeleteDialogOpen(false);
    alert("Account deleted permanently.");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      {/* Login Email */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Login Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {editingEmail ? (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter new email"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setEditingEmail(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleEmailSave}>Save</Button>
              </div>
            </>
          ) : (
            <>
              <p className="font-medium">{email}</p>
              <p
                className={`text-sm ${emailVerified ? "text-green-600" : "text-red-600"}`}
              >
                {emailVerified ? "Verified" : "Not Verified"}
              </p>
              <Button onClick={() => setEditingEmail(true)}>
                Change Email
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handlePasswordChange}>Change Password</Button>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p
            className={`font-medium ${accountStatus === "Active" ? "text-green-600" : "text-red-600"}`}
          >
            {accountStatus}
          </p>
          <Button variant="outline" onClick={toggleAccountStatus}>
            {accountStatus === "Active"
              ? "Deactivate Account"
              : "Reactivate Account"}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription Plan */}
      <Card>
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
          <Button onClick={handleSubscriptionChange}>
            Change / Upgrade Plan
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <DeleteAccountPopupForm />
    </div>
  );
}
