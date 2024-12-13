import { SettingsSideBar } from "@/components/pages/settings/sections/SideBar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import routes from "@/data/routes.json";
export default async function SettingsLayout({ children }) {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  if (!isLoggedIn) {
    return redirect(
      routes.login.path +
        "?callbackPath=" +
        encodeURIComponent(routes.settings.path)
    );
  }

  return (
    <main className="mx-auto mt-10 mb-[80px] w-[95%] sm:w-[90%] ">
      <div className={"mb-4"}>
        <h1 className="text-3xl mb-2 font-bold">Settings</h1>
        <p className="text-sm opacity-60">Manage your account in settings.</p>
      </div>
      <div className={"flex flex-col md:flex-row bg-white rounded-md"}>
        <SettingsSideBar />
        {/* Main Content */}
        <div className="p-4 flex-1">{children}</div>
      </div>
    </main>
  );
}
