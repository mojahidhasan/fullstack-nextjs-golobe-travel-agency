"use client";
import { AccountSettings } from "@/components/pages/settings/sections/AccountSettings";
import { AppearanceSettings } from "@/components/pages/settings/sections/AppearanceSettings";
import { PaymentSettings } from "@/components/pages/settings/sections/PaymentSettings";
import { ProfileSettings } from "@/components/pages/settings/sections/ProfileSettings";
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
      case "appearance":
        return <AppearanceSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return <div>{renderContent()}</div>;
}
