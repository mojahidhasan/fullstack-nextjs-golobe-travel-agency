"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Dropdown({ title, open, classNames, children }) {
  const [isOpen, setIsOpen] = useState(open);
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  return (
    <Accordion
      className={classNames?.parent}
      type="single"
      value={isOpen && "item-1"}
      collapsible
    >
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger
          className={cn("rounded-md bg-primary/30 p-4", classNames?.trigger)}
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </AccordionTrigger>
        <AccordionContent className={cn("my-3", classNames?.content)}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
