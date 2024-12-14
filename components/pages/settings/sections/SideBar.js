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
        "p-4 w-full md:w-60 xl:w-80 border-r-0 border-b md:border-r md:border-b-0 border-slate-200"
      }
    >
      <ul className={"flex flex-col gap-2"}>
        {settingTabs.map((tab, i) => (
          <li key={tab} className={"w-full hover:bg-slate-100 rounded-md"}>
            <Link
              className={cn(
                "p-2 h-full w-full block",
                isActive(tab),
                i === 0 && !currentTab && "font-bold text-primary bg-primary/10"
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
