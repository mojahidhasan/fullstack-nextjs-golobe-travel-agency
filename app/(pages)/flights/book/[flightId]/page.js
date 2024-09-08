import { BreadcrumbUI } from "@/components/local-ui/breadcrumb";
import { FareCard } from "@/components/FareCard";
import { FlightDetailsCard } from "@/components/FlightDetailsCard";
import { AuthenticationCard } from "@/components/AuthenticationCard";
import { ChoosePaymentCard } from "@/components/pages/flights.book/ChoosePaymentCard";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import Link from "next/link";
export default function FlightBookPage() {
  const breadcrumb = [
    { id: 1, title: "Turkey", link: "/" },
    { id: 2, title: "Istanbul", link: "/" },
    { id: 3, title: "CVK Park Bosphorus Hotel Istanbul", link: "/" },
  ];

  const isLoggedIn = true; // Math.round(Math.random());

  return (
    <>
      <main className="mx-auto mb-[80px] mt-[40px] w-[90%] text-secondary">
        <BreadcrumbUI />

        <div className="mt-[30px] flex gap-[20px] max-lg:flex-col-reverse lg:gap-[30px] xl:gap-[40px]">
          <div>
            <FlightDetailsCard />
            <div className="mb-[20px] rounded-[12px] bg-white p-[16px] shadow-lg lg:mb-[30px] xl:mb-[40px]">
              <RadioGroup defaultValue="Pay_in_full">
                <Label className="flex rounded-[12px] justify-between p-[16px] has-[[data-state='checked']]:bg-primary grow items-center gap-[32px]">
                  <div>
                    <p className="font-bold mb-2">Pay in full</p>
                    <p className="text-[0.875rem]">
                      Pay the total and you are all set
                    </p>
                  </div>
                  <RadioGroupItem
                    className="data-[state='checked']:text-white border-2 data-[state='checked']:border-white"
                    value="Pay_in_full"
                  />
                </Label>
                <Label className="flex rounded-[12px] justify-between p-[16px] has-[[data-state='checked']]:bg-primary grow items-center gap-[32px]">
                  <div>
                    <p className="font-bold mb-2">Pay part now, part later</p>
                    <p className="text-[0.875rem]">
                      Pay $207.43 now, and the rest ($207.43) will be
                      automatically charged to the same payment method on Nov
                      14, 2022. No extra fees.
                    </p>
                  </div>
                  <RadioGroupItem
                    className="data-[state='checked']:text-white border-2 data-[state='checked']:border-white"
                    value="Pay_part"
                  />
                </Label>
              </RadioGroup>
              <p className="p-[16px]">
                <Link href="/" className="underline">
                  More info
                </Link>
              </p>
            </div>

            <div className="rounded-12px bg-white p-16px shadow-small">
              {isLoggedIn ? <ChoosePaymentCard /> : <AuthenticationCard />}
            </div>
          </div>
          <div className="h-min flex-grow rounded-12px bg-white p-24px shadow-small">
            <FareCard />
          </div>
        </div>
      </main>
    </>
  );
}
