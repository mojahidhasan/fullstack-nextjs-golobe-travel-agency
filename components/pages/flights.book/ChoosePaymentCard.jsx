// dummy component with dummy data.. already has replaced by functional component for flight booking..
// only has not been replaced by hotel booking payment compoent..
// this component is still being use there as for dummy component
// this compoenent will be removed soon

import { AddPaymentCard } from "@/components/pages/profile/AddPaymentCard";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Image from "next/image";
import visaIcon from "@/public/icons/cards/visa.svg";

export function ChoosePaymentCard() {
  return (
    <div className="rounded-[12px] p-4 shadow-lg">
      <RadioGroup defaultValue="default">
        <Label
          htmlFor="r1"
          className="flex grow items-center justify-between gap-[32px] rounded-[12px] p-[16px] has-[[data-state='checked']]:bg-primary"
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
            className="border-2 data-[state='checked']:border-white data-[state='checked']:text-white"
            value="default"
            id="r1"
          />
        </Label>
        <Label
          htmlFor="r2"
          className="flex grow items-center justify-between gap-[32px] rounded-[12px] p-[16px] has-[[data-state='checked']]:bg-primary"
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
            className="border-2 data-[state='checked']:border-white data-[state='checked']:text-white"
            value="comfortable"
            id="r2"
          />
        </Label>
        <Label
          htmlFor="r3"
          className="flex grow items-center justify-between gap-[32px] rounded-[12px] p-[16px] has-[[data-state='checked']]:bg-primary"
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
            className="border-2 data-[state='checked']:border-white data-[state='checked']:text-white"
            value="compact"
            id="r3"
          />
        </Label>
      </RadioGroup>
      <AddPaymentCard className={"mt-4 w-full"} />
    </div>
  );
}
