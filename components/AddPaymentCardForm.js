import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  SelectShadcn,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import Image from "next/image";

import visa from "@/public/icons/visa.svg";
export function AddPaymentCardForm() {
  return (
    <form action="" className="mt-5 flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-[24px]">
        <Label
          className={
            "relative focus-within:border-blue-500 flex gap-1 rounded-[8px] border-2 border-secondary col-span-2 h-auto text-secondary"
          }
        >
          <span className="absolute -top-[10px] left-[5%] block bg-white px-[4px] text-[0.875rem]">
            Card Number
          </span>
          <Input
            className="h-[40px] rounded-[8px] border-0 w-full bg-white px-[16px] py-[8px] text-[1rem] outline-none placeholder:text-secondary/50 max-lg:placeholder:text-[0.875rem] lg:h-[56px]"
            name={"cardNumber"}
            placeholder={"Add card number"}
            min={0}
            required
          />
          <Popover>
            <PopoverTrigger>
              <Image
                className="mr-2"
                src={visa}
                width={24}
                height={16}
                alt="visa_icon"
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex">
                <Image
                  className="mr-2"
                  src={visa}
                  width={24}
                  height={16}
                  alt="visa_icon"
                />
                <span>Visa</span>
              </div>
              <div className="flex">
                <Image
                  className="mr-2"
                  src={visa}
                  width={24}
                  height={16}
                  alt="visa_icon"
                />
                <span>Paypal</span>
              </div>
              <div className="flex">
                <Image
                  className="mr-2"
                  src={visa}
                  width={24}
                  height={16}
                  alt="visa_icon"
                />
                <span>Master card</span>
              </div>
            </PopoverContent>
          </Popover>
        </Label>
        {/* <p className={error?.[name] ? "text-error" : ""}>
                                {error?.[name]}
                            </p> */}
        <Label
          className={
            "relative focus-within:border-blue-500 flex gap-1 rounded-[8px] border-2 border-secondary col-span-1 h-auto text-secondary"
          }
        >
          <span className="absolute -top-[10px] left-[5%] block bg-white px-[4px] text-[0.875rem]">
            Exp. Date
          </span>
          <Input placeholder={"12/12"} className={"outline-none"} />
        </Label>

        {/* <p className={error?.[name] ? "text-error" : ""}>
                                {error?.[name]}
                            </p> */}
        <Label
          className={
            "relative focus-within:border-blue-500 flex gap-1 rounded-[8px] border-2 border-secondary col-span-1 h-auto text-secondary"
          }
        >
          <span className="absolute -top-[10px] left-[5%] block bg-white px-[4px] text-[0.875rem]">
            CVC
          </span>
          <Input placeholder={"123"} className={"outline-none"} />
        </Label>
        {/* <p className={error?.[name] ? "text-error" : ""}>
                                {error?.[name]}
                            </p> */}
        <Label
          className={
            "relative focus-within:border-blue-500 flex gap-1 rounded-[8px] border-2 border-secondary col-span-2 h-auto text-secondary"
          }
        >
          <span className="absolute -top-[10px] left-[5%] block bg-white px-[4px] text-[0.875rem]">
            Name on card
          </span>
          <Input placeholder={"Name on the card"} className={"outline-none"} />
        </Label>
        {/* <p className={error?.[name] ? "text-error" : ""}>
                                {error?.[name]}
                            </p> */}
        <Label
          className={
            "relative focus-within:border-blue-500 flex gap-1 rounded-[8px] border-2 border-secondary col-span-2 h-auto text-secondary"
          }
        >
          <span className="absolute -top-[10px] left-[5%] block bg-white px-[4px] text-[0.875rem]">
            Country or region
          </span>
          <SelectShadcn>
            <SelectTrigger className="focus-within::ring-0 bg-white hover:bg-slate-500/10 w-full h-full border-0 ring-blue-700">
              <SelectValue
                className="lg:h-[56px] h-[40px]"
                defaultValue={"Bangladesh"}
                placeholder={"Bangladesh"}
              />
            </SelectTrigger>
            <SelectContent className={"bg-primary"}>
              <SelectGroup>
                <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="Pakistan">Pakistan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </SelectShadcn>
        </Label>
      </div>
      <div>
        <Checkbox
          id={"securlySave"}
          name={"securlySave"}
          label={"Securely save my information for 1-click checkout"}
        />
      </div>
      <Button className={"w-full"} type="submit">
        Add Card
      </Button>
    </form>
  );
}
