import AccountSettings from "@/components/pages/settings/sections/AccountSettings";
import AppearanceSettings from "@/components/pages/settings/sections/AppearanceSettings";
import PaymentSettings from "@/components/pages/settings/sections/PaymentSettings";
import ProfileSettings from "@/components/pages/settings/sections/ProfileSettings";
import SecuritySettings from "@/components/pages/settings/sections/SecuritySettings";
import { auth } from "@/lib/auth";
import { getUserDetails } from "@/lib/services/user";

export default async function SettingsPage({ searchParams }) {
  const tab = searchParams.tab;

  const session = await auth();
  const userDetails = await getUserDetails(session?.user?.id);
  const renderContent = () => {
    switch (tab) {
      case "account":
        return <AccountSettings userDetails={userDetails} />;
      case "payments":
        return <PaymentSettings />;
      case "security":
        return <SecuritySettings />;
      case "appearance":
        return <AppearanceSettings />;
      default:
        return <ProfileSettings userDetails={userDetails} />;
    }
  };

  return <div>{renderContent()}</div>;
}
