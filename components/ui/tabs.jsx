"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ ref }
    className={ cn(
      "inline-flex h-auto items-center justify-center rounded-md bg-muted text-muted-foreground gap-1",
      className
    ) }
    { ...props } />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ ref }
    className={ cn(
      "inline-flex items-center justify-center whitespace-nowrap py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:shadow-sm h-14 sm:h-16 px-4 w-full sm:w-auto transition-all duration-300 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 data-[state=active]:text-primary border data-[state=active]:border-b-4 data-[state=active]:border-primary gap-[6px] font-bold",
      className
    ) }
    { ...props } />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ ref }
    className={ cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ) }
    { ...props } />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
