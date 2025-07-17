"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PaymentSettings() {
  const [defaultMethod, setDefaultMethod] = useState("Visa **** 1234");
  const [billingAddress, setBillingAddress] = useState("");
  const [currency, setCurrency] = useState("USD");

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-10">
      {/* Default Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Default Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={defaultMethod}
            onChange={(e) => setDefaultMethod(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option>Visa **** 1234</option>
            <option>MasterCard **** 5678</option>
            <option>PayPal - mojahid@email.com</option>
          </select>
        </CardContent>
      </Card>

      {/* Saved Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Saved Cards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Visa **** 1234</p>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">MasterCard **** 5678</p>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div>
          <Button className="mt-4">Add New Payment Method</Button>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="123 Street Name, City, ZIP"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
          />
          <Button variant="outline">Save Address</Button>
        </CardContent>
      </Card>

      {/* Currency Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Currency Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option>USD</option>
            <option>BDT</option>
            <option>EUR</option>
          </select>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-muted-foreground">
            You can download your payment history below.
          </p>
          <Button variant="outline">Download PDF</Button>
        </CardContent>
      </Card>
    </div>
  );
}
