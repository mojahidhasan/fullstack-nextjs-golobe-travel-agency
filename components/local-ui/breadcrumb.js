"use client";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname } from "next/navigation";
export function BreadcrumbUI() {
  const pathname = usePathname().split("/");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname.map((path, i, arr) => {
          const link = path ? pathname.slice(0, i + 1).join("/") : "/";
          if (arr.length - 1 === i) {
            return (
              <BreadcrumbItem key={path}>
                <BreadcrumbPage>{path}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }
          return (
            <>
              <BreadcrumbItem key={path}>
                <BreadcrumbLink className="text-tertiary" asChild>
                  <Link href={link}>{path || "Home"}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
