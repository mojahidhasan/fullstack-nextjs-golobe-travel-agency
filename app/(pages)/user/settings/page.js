"use client";
import AccountSettings from "@/components/pages/settings/sections/AccountSettings";
import AppearanceSettings from "@/components/pages/settings/sections/AppearanceSettings";
import PaymentSettings from "@/components/pages/settings/sections/PaymentSettings";
import ProfileSettings from "@/components/pages/settings/sections/ProfileSettings";
import SecuritySettings from "@/components/pages/settings/sections/SecuritySettings";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const initialData = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+8801XXXXXXXXX",
    dob: "1998-07-20",
    country: "USA",
    preferredClass: "economy",
    language: "en",
  };
  const user = {
    id: "6620a5a2f08419d07f9a2d11",
    email: "john.doe@example.com",
    createdAt: "2024-08-01T12:00:00.000Z",
  };

  const renderContent = () => {
    switch (tab) {
      case "account":
        return <AccountSettings user={user} />;
      case "payments":
        return <PaymentSettings />;
      case "security":
        return <SecuritySettings />;
      case "appearance":
        return <AppearanceSettings />;
      default:
        return <ProfileSettings initialData={initialData} />;
    }
  };

  return <div>{renderContent()}</div>;
}
