import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
export function Dropdown({ title, open, className, children }) {
  return (
    <Accordion
      className={cn(className)}
      type="single"
      defaultValue={open && "item-1"}
      collapsible
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
