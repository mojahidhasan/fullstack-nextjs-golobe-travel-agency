"use client";
import { AccountSettings } from "@/components/pages/settings/sections/AccountSettings";
import { PaymentSettings } from "@/components/pages/settings/sections/PaymentSettings";
import { SecuritySettings } from "@/components/pages/settings/sections/SecuritySettings";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const renderContent = () => {
    switch (tab) {
      case "account":
        return <AccountSettings />;
      case "payments":
        return <PaymentSettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return <div>Profile Settings</div>;
    }
  };

  return <div>{renderContent()}</div>;
}
