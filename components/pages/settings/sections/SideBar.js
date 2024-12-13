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
  return (
    <div
      className={
        "p-4 w-full md:w-60 xl:w-80 border-r-0 border-b md:border-r md:border-b-0 border-slate-200"
      }
    >
      <ul className={"flex flex-col gap-2"}>
        <li className={"w-full hover:bg-slate-100 rounded-md"}>
          <Link
            className={cn(
              "p-2 h-full w-full block ",
              isActive("profile"),
              !currentTab && "font-bold text-primary bg-primary/10"
            )}
            href={`${routes.settings.path}?tab=profile`}
          >
            Profile
          </Link>
        </li>
        <li className={"w-full hover:bg-slate-100 rounded-md"}>
          <Link
            className={cn("p-2 h-full w-full block", isActive("account"))}
            href={`${routes.settings.path}?tab=account`}
          >
            Account
          </Link>
        </li>
        <li className={"w-full hover:bg-slate-100 rounded-md"}>
          <Link
            className={cn("p-2 h-full w-full block", isActive("payments"))}
            href={`${routes.settings.path}?tab=payments`}
          >
            Payments
          </Link>
        </li>
        <li className={"w-full hover:bg-slate-100 rounded-md"}>
          <Link
            className={cn("p-2 h-full w-full block", isActive("security"))}
            href={`${routes.settings.path}?tab=security`}
          >
            Security
          </Link>
        </li>
      </ul>
    </div>
  );
}
