import { AddPaymentCard } from "@/components/AddPaymentCard";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Image from "next/image";
import visaIcon from "@/public/icons/visa.svg";

export function ChoosePaymentCard() {
  return (
    <div className="p-4 rounded-[12px] shadow-lg">
      <RadioGroup defaultValue="default">
        <Label
          htmlFor="r1"
          className="flex rounded-[12px] justify-between p-[16px] has-[[data-state='checked']]:bg-primary grow items-center gap-[32px]"
        >
          <div className="flex items-center gap-[32px]">
            <Image width={24} height={16} src={visaIcon} alt="visa_icon" />
            <p className="text-[0.875rem]">
              <span className="font-tradeGothic text-[1rem] font-bold">
                **** 4321
              </span>{" "}
              <span>02/27</span>
            </p>
          </div>
          <RadioGroupItem
            className="data-[state='checked']:text-white border-2 data-[state='checked']:border-white"
            value="default"
            id="r1"
          />
        </Label>
        <Label
          htmlFor="r2"
          className="flex rounded-[12px] justify-between p-[16px] has-[[data-state='checked']]:bg-primary grow items-center gap-[32px]"
        >
          <div className="flex items-center gap-[32px]">
            <Image width={24} height={16} src={visaIcon} alt="visa_icon" />
            <p className="text-[0.875rem]">
              <span className="font-tradeGothic text-[1rem] font-bold">
                **** 4321
              </span>{" "}
              <span>02/27</span>
            </p>
          </div>
          <RadioGroupItem
            className="data-[state='checked']:text-white border-2 data-[state='checked']:border-white"
            value="comfortable"
            id="r2"
          />
        </Label>
        <Label
          htmlFor="r3"
          className="flex rounded-[12px] justify-between p-[16px] has-[[data-state='checked']]:bg-primary grow items-center gap-[32px]"
        >
          <div className="flex items-center gap-[32px]">
            <Image width={24} height={16} src={visaIcon} alt="visa_icon" />
            <p className="text-[0.875rem]">
              <span className="font-tradeGothic text-[1rem] font-bold">
                **** 4321
              </span>{" "}
              <span>02/27</span>
            </p>
          </div>
          <RadioGroupItem
            className="data-[state='checked']:text-white border-2 data-[state='checked']:border-white"
            value="compact"
            id="r3"
          />
        </Label>
      </RadioGroup>
      <AddPaymentCard className={"w-full mt-4"} />
    </div>
  );
}
