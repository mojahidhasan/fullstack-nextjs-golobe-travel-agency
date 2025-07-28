"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import routes from "@/data/routes.json";
export function SettingsSideBar() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const isActive = (tab) =>
    currentTab === tab ? "font-bold text-primary bg-primary/10" : "";

  const settingTabs = [
    "profile",
    "account",
    "payments",
    "security",
    "appearance",
  ];
  return (
    <div
      className={
        "w-full border-b border-r-0 border-slate-200 p-4 md:w-60 md:border-b-0 md:border-r xl:w-80"
      }
    >
      <ul className={"flex flex-col gap-2"}>
        {settingTabs.map((tab, i) => (
          <li key={tab} className={"w-full rounded-md hover:bg-slate-100"}>
            <Link
              className={cn(
                "block h-full w-full p-2 capitalize",
                isActive(tab),
                i === 0 &&
                  !currentTab &&
                  "bg-primary/10 font-bold text-primary",
              )}
              href={`${routes.settings.path}?tab=${tab}`}
            >
              {tab}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
